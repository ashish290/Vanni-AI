import { User, Payment } from "../models/index.js";
import {
  createOrder as createRazorpayOrder,
  verifyPaymentSignature,
  updatePaymentSuccess,
  markPaymentFailed,
} from "../services/razorpayService.js";

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!["basic", "pro"].includes(plan)) {
      return res.status(400).json({ success: false, error: "Invalid plan" }); 
    }

    const orderParams = await createRazorpayOrder(req.user.userId, plan);

    res.json({
      success: true,
      ...orderParams,
      plan,
      userEmail: req.user.email,
      userName: req.user.name,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};

// ─── POST /api/payment/verify ───────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      req.body;

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!isValid) {
      await markPaymentFailed(razorpay_order_id);
      return res
        .status(400)
        .json({ success: false, error: "Payment verification failed" });
    }

    // Payment is valid, update db
    await updatePaymentSuccess(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    user.plan = plan;
    user.planExpiresAt = expiresAt;
    user.voiceEnabled = plan === "basic" || plan === "pro"; // All paid plans have voice

    // Reset usage limits for new plan
    user.dailyCount = 0;
    user.lastReset = new Date().toISOString().split("T")[0];

    await user.save();

    res.json({
      success: true,
      plan,
      message: "Plan upgraded successfully 🎉",
      expiresAt,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ success: false, error: "Failed to verify payment" });
  }
};

// ─── GET /api/payment/history ───────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, payments });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch history" });
  }
};

// ─── POST /api/payment/webhook ──────────────────────────────
export const handleWebhook = async (req, res) => {
  try {
    // Basic verification - better implementation uses razorpay webhook signature
    // using crypto and the webhook secret
    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;

    if (event === "payment.captured" && paymentEntity) {
      const orderId = paymentEntity.order_id;
      // You could update payment table here as backup if frontend crashed during verify
      console.log("Webhook: payment captured for order", orderId);
    } else if (event === "payment.failed" && paymentEntity) {
      const orderId = paymentEntity.order_id;
      await markPaymentFailed(orderId);
      console.log("Webhook: payment failed for order", orderId);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(200).send("OK"); // Always 200 for Razorpay retries
  }
};
