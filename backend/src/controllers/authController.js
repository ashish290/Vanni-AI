import crypto from "crypto";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwtUtils.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/dbService.js";
import { initializeRoadmap } from "../services/roadmapService.js";
import { generateOTP, generateOTPExpiry } from "../utils/utils.js";
import { sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";
import { User, PasswordReset } from "../models/index.js";

// Step 1: Request OTP for Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const successMsg = {
      success: true,
      message: "Agar yeh email registered hai toh OTP aa jayega! 📧",
    };

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    }

    const user = await findUserByEmail(email);
    // Security: don't reveal if user exists
    if (!user) return res.json(successMsg);

    // Invalidate previous OTPs
    await PasswordReset.update(
      { isUsed: true },
      { where: { email, isUsed: false } },
    );

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await PasswordReset.create({
      email,
      otpHash,
      expiresAt,
    });

    await sendOTPEmail(email, otp);
    res.json(successMsg);
  } catch (error) {
    next(error);
  }
};

// Step 2: Verify OTP and Grant Reset Token
export const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const record = await PasswordReset.findOne({
      where: { email, isUsed: false },
      order: [["createdAt", "DESC"]],
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        error: "Koi active OTP nahi mila! Dobara request karo.",
      });
    }

    // Check Lockout
    if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
      const secondsLeft = Math.ceil(
        (new Date(record.lockedUntil) - new Date()) / 1000,
      );
      return res.status(429).json({
        success: false,
        error: `Zyada galat attempts! ${secondsLeft} seconds baad try karo 🔒`,
        lockedUntil: record.lockedUntil,
      });
    }

    // Check Expiry
    if (new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "OTP expire ho gaya! Nayi request karo ⏰",
        expired: true,
      });
    }

    const isValid = await bcrypt.compare(otp, record.otpHash);
    if (!isValid) {
      const newAttempts = record.attempts + 1;
      let updateData = { attempts: newAttempts };

      if (newAttempts >= 3) {
        updateData.lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
      }

      await record.update(updateData);

      if (newAttempts >= 3) {
        return res.status(429).json({
          success: false,
          error: "Zyada galat attempts! 5 minutes ke liye lock ho gaya 🔒",
          lockedUntil: updateData.lockedUntil,
        });
      }

      return res.status(400).json({
        success: false,
        error: `Galat OTP! ${3 - newAttempts} attempts baaki hain ❌`,
        attemptsLeft: 3 - newAttempts,
      });
    }

    // Valid OTP - Generate short-lived reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    await record.update({
      isUsed: true,
      resetTokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins for password reset
    });

    res.json({
      success: true,
      resetToken,
      message: "OTP verified! Ab naya password set karo ✅",
    });
  } catch (error) {
    next(error);
  }
};

// Step 3: Update Password with Reset Token
export const resetPassword = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password kam se kam 6 characters ka hona chahiye!",
      });
    }

    const record = await PasswordReset.findOne({
      where: { email, isUsed: true },
      order: [["createdAt", "DESC"]],
    });

    if (!record || !record.resetTokenHash) {
      return res.status(400).json({
        success: false,
        error: "Invalid reset session! Dobara try karo.",
      });
    }

    // Check 15 min session expiry
    if (new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "Reset session expire ho gayi! Dobara OTP maango ⏰",
        sessionExpired: true,
      });
    }

    const isTokenValid = await bcrypt.compare(
      resetToken,
      record.resetTokenHash,
    );
    if (!isTokenValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid reset token! Security issue detected.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check new password != old password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: "Naya password purane se alag hona chahiye! 🙏",
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash: newHash });

    // Cleanup all reset records for this email
    await PasswordReset.destroy({ where: { email } });

    res.json({
      success: true,
      message: "Password successfully change ho gaya! Ab login karo 🎉",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, level } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    const user = await createUser({
      name,
      email,
      passwordHash,
      level: level || "beginner",
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Send OTP Email
    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email with the OTP sent.",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, error: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, error: "Email already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ success: false, error: "OTP expired" });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Initialize learning roadmap (if not already done)
    try {
      await initializeRoadmap(user.id, user.level || "beginner");
    } catch (err) {
      console.log("Roadmap init skipped:", err.message);
    }

    const token = signToken(user);

    await sendWelcomeEmail(user.email, user.name);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/resend-otp
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, error: "Email already verified" });
    }

    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP Email
    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email address before logging in.",
        needsVerification: true,
        email: user.email,
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        streak: user.streak,
        messageCount: user.messageCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        streak: user.streak,
        messageCount: user.messageCount?.toNumber
          ? user.messageCount.toNumber()
          : user.messageCount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
