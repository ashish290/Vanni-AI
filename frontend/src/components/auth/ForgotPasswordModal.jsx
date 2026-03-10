import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import * as api from "../../services/api";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes (600 seconds)
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const otpRefs = useRef([]);

  const clearSession = useCallback(() => {
    localStorage.removeItem("vaani_reset_session");
    setStep(1);
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const saved = localStorage.getItem("vaani_reset_session");
    if (saved) {
      const {
        step: savedStep,
        email: savedEmail,
        resetToken: savedToken,
        expiresAt,
      } = JSON.parse(saved);
      if (Date.now() < expiresAt) {
        if (
          confirm(
            "Aapka password reset incomplete tha! Kya aap continue karna chahte ho? ⏰",
          )
        ) {
          setStep(savedStep);
          setEmail(savedEmail);
          setResetToken(savedToken);
        } else {
          clearSession();
        }
      } else {
        localStorage.removeItem("vaani_reset_session");
        toast("Reset session expire ho gayi 🙏");
      }
    }
  }, [clearSession]);

  // Sync session across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "vaani_reset_session" && !e.newValue && step > 1) {
        toast.success("Password reset ho gaya doosre tab mein! 🎉");
        onClose();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [step, onClose]);

  // Timer for Step 2
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Lock timer
  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => setLockTimer((prev) => prev - 1), 1000);
    } else if (lockTimer === 0) {
      setIsLocked(false);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  // Resend cooldown
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email) return toast.error("Email daalna zaroori hai!");

    setIsLoading(true);
    try {
      const data = await api.forgotPassword(email);
      if (data.success) {
        toast.success(data.message);
        setStep(2);
        setTimer(600);
        setCanResend(false);
        setResendCooldown(30);
      } else {
        toast.error(data.error || "Kuch dikkat aayi, retry karo!");
      }
    } catch (err) {
      toast.error("Network issue! Retry karo 📧");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue) => {
    setIsLoading(true);
    try {
      const data = await api.verifyResetOTP(email, otpValue);
      if (data.success) {
        setResetToken(data.resetToken);
        setStep(3);
        localStorage.setItem(
          "vaani_reset_session",
          JSON.stringify({
            step: 3,
            email,
            resetToken: data.resetToken,
            expiresAt: Date.now() + 15 * 60 * 1000,
          }),
        );
        toast.success(data.message);
      } else {
        if (data.lockedUntil) {
          setIsLocked(true);
          setLockTimer(300); // 5 mins
        }
        toast.error(data.error);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0].focus();
      }
    } catch (err) {
      toast.error("Verification fail! Retry karo 🔄");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Passwords alag hain!");
    if (newPassword.length < 6) return toast.error("Chhota password hai!");

    setIsLoading(true);
    try {
      const data = await api.resetPassword(email, resetToken, newPassword);
      if (data.success) {
        toast.success(data.message);
        clearSession();
        // Success animation then close
        setTimeout(() => onClose(), 2000);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Password update nahi hua! Retry karo 🙏");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.length === 6 && pasteData.every((char) => !isNaN(char))) {
      setOtp(pasteData);
      handleVerifyOTP(pasteData.join(""));
    }
  };

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 5) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#1B4F72]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAFAF8] w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden relative animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Transition Header */}
          <div className="text-center mb-8">
            <div
              className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                step === 1
                  ? "bg-saffron-100 text-saffron-500"
                  : step === 2
                    ? "bg-blue-100 text-blue-500"
                    : "bg-green-100 text-green-500"
              }`}
            >
              {step === 1 && <Mail size={32} />}
              {step === 2 && <Lock size={32} />}
              {step === 3 && <CheckCircle size={32} />}
            </div>

            <h2 className="text-2xl font-baloo font-bold text-[#1B4F72] mb-2 leading-tight">
              {step === 1 && "Password Bhool Gaye? 🤔"}
              {step === 2 && "OTP Check Karo! 📱"}
              {step === 3 && "Naya Password Banao! 🔐"}
            </h2>
            <p className="text-gray-500 text-sm font-hind">
              {step === 1 &&
                "Apna registered email daalo, OTP bhejenge turant!"}
              {step === 2 && (
                <span>
                  {email.replace(/(.{3})(.*)(?=@)/, "$1***")} pe OTP bheja gaya
                  hai
                </span>
              )}
              {step === 3 && "Strong password choose karo carefully"}
            </p>
          </div>

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-xl font-hind text-gray-700 focus:border-saffron-300 focus:ring-4 focus:ring-saffron-100 outline-none transition-all group-hover:border-gray-200"
                />
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saffron-400"
                  size={20}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-600 hover:to-saffron-700 text-white font-baloo font-bold text-lg rounded-xl shadow-lg shadow-saffron-200 transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Mail size={20} />
                )}
                {isLoading ? "OTP bhej rahe hain..." : "OTP Bhejo 📧"}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <div className="flex gap-2 mb-6" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      autoFocus={i === 0}
                      className={`w-12 h-14 text-center text-2xl font-bold font-mono rounded-xl border-2 transition-all outline-none focus:ring-4 ${
                        digit
                          ? "bg-[#1B4F72] text-white border-[#1B4F72]"
                          : "bg-white text-gray-700 border-gray-100 focus:border-saffron-300 focus:ring-saffron-500/10"
                      }`}
                    />
                  ))}
                </div>

                <div
                  className={`text-sm font-hind flex items-center gap-2 ${timer < 120 ? "text-red-500" : "text-gray-400"}`}
                >
                  <span className="animate-pulse">⏰</span>
                  OTP expire hoga: <strong>{formatTime(timer)}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {isLocked ? (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-center text-sm font-hind">
                    🚫 Zyada galat attempts!{" "}
                    <strong>{formatTime(lockTimer)}</strong> baad try karo
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendOTP()}
                    disabled={resendCooldown > 0 || isLoading}
                    className="w-full text-center py-2 text-saffron-500 font-baloo font-bold hover:text-saffron-600 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    {resendCooldown > 0
                      ? `Resend OTP (${resendCooldown}s)`
                      : "OTP nahi mila? Dobara bhejo 🔄"}
                  </button>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-hind text-sm transition-colors"
                >
                  <ArrowLeft size={16} /> Edit Email
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                    className="w-full h-14 pl-12 pr-12 bg-white border-2 border-gray-100 rounded-xl font-hind text-gray-700 focus:border-green-300 focus:ring-4 focus:ring-green-100 outline-none transition-all group-hover:border-gray-200"
                  />
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-400"
                    size={20}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Strength Meter */}
                <div className="flex gap-1 h-1.5 px-0.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-all duration-500 ${
                        getPasswordStrength(newPassword) >= level
                          ? level <= 1
                            ? "bg-red-400"
                            : level <= 2
                              ? "bg-orange-400"
                              : level <= 3
                                ? "bg-yellow-400"
                                : "bg-green-500"
                          : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-xl font-hind text-gray-700 focus:border-green-300 focus:ring-4 focus:ring-green-100 outline-none transition-all group-hover:border-gray-200"
                  />
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-400"
                    size={20}
                  />
                </div>

                {confirmPassword && (
                  <div
                    className={`text-xs font-hind flex items-center gap-1.5 px-1 ${
                      newPassword === confirmPassword
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {newPassword === confirmPassword ? (
                      <CheckCircle size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    {newPassword === confirmPassword
                      ? "Passwords match ho gaye!"
                      : "Passwords nahi mil rahe"}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  newPassword !== confirmPassword ||
                  newPassword.length < 6
                }
                className="w-full h-14 bg-gradient-to-r from-[#1B4F72] to-[#2E86C1] hover:from-[#2E86C1] hover:to-[#3498DB] text-white font-baloo font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Lock size={20} />
                )}
                {isLoading ? "Updating..." : "Password Update Karo 🚀"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordModal;
