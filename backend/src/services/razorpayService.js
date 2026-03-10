import Razorpay from "razorpay";
import crypto from "crypto";
import { Payment } from "../models/index.js";

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn(
        "⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in .env! Payment flows will fail.",
      );
    }
    // Initialize with dummy strings to prevent startup crash if env vars are missing
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey12345",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret_54321",
    });
  }
  return razorpayInstance;
};

export const getPlanAmount = (plan) => {
  return plan === "pro" ? 29900 : 14900;
};

export const createOrder = async (userId, plan) => {
  const amount = getPlanAmount(plan);

  const shortId = crypto.randomUUID().slice(0, 8);
  const options = {
    amount,
    currency: "INR",
    receipt: `rcpt_${shortId}_${Date.now()}`.slice(0, 40),
    notes: { userId, plan },
  };

  const razorpay = getRazorpay();
  const order = await razorpay.orders.create(options);

  // Save to DB
  await Payment.create({
    userId,
    razorpayOrderId: order.id,
    plan,
    amount,
    currency: "INR",
    status: "created",
  });

  return {
    orderId: order.id,
    amount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey12345",
  };
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  return generatedSignature === signature;
};

export const updatePaymentSuccess = async (orderId, paymentId, signature) => {
  const payment = await Payment.findOne({
    where: { razorpayOrderId: orderId },
  });
  if (!payment) throw new Error("Payment record not found");

  payment.status = "paid";
  payment.razorpayPaymentId = paymentId;
  payment.razorpaySignature = signature;
  payment.paidAt = new Date();

  await payment.save();
  return payment;
};

export const markPaymentFailed = async (orderId) => {
  const payment = await Payment.findOne({
    where: { razorpayOrderId: orderId },
  });
  if (payment) {
    payment.status = "failed";
    await payment.save();
  }
};
