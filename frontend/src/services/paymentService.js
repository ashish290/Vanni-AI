import { getHeaders, API_URL } from "./api";

/**
 * Initiates Razorpay payment for upgrading plan.
 */
export const initiatePayment = async (planName, userDetails) => {
  try {
    // 1. Create order on backend
    const createOrderRes = await fetch(`${API_URL}/api/payment/create-order`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ plan: planName }),
    });

    const orderData = await createOrderRes.json();
    if (!orderData.success) {
      throw new Error(orderData.error || "Failed to create order");
    }

    // Return the required params for Razorpay options
    return orderData;
  } catch (error) {
    console.error("Initiate payment error:", error);
    throw error;
  }
};

/**
 * Verifies payment signature with backend to officially upgrade the plan.
 */
export const verifyAndUpgrade = async (response, planName) => {
  try {
    const res = await fetch(`${API_URL}/api/payment/verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        plan: planName,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Payment verification failed");
    }

    return data;
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
};
