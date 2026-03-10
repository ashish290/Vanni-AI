import { useState } from "react";
import { useAuth } from "./useAuth";
import { initiatePayment, verifyAndUpgrade } from "../services/paymentService";
import toast from "react-hot-toast";

// VITE_RAZORPAY_KEY_ID should be available in your .env
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxx";

export const usePayment = () => {
  const { user, login } = useAuth(); // login or refreshUser could be used to update context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleUpgrade = async (planName, onSuccessCallback) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Create order on backend
      const orderData = await initiatePayment(planName, {
        name: user.name,
        email: user.email,
      });

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.keyId || RAZORPAY_KEY,
        amount: orderData.amount, // in paise
        currency: orderData.currency,
        name: "Vanni AI",
        description: `${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan - Monthly`,
        // image: "/src/assets/icon.svg", // Optional
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: "", // can be empty or added if you have phone
        },
        theme: {
          color: "#FF6B35", // Saffron orange branding
        },
        handler: async function (response) {
          try {
            // 3. Verify payment signature on backend
            await verifyAndUpgrade(response, planName);

            // 4. Update local state and finish
            setSuccess(true);
            toast.success("Plan upgraded successfully!");
            if (onSuccessCallback) onSuccessCallback(planName);
          } catch (verifyErr) {
            const msg = verifyErr.message || "Payment verification failed";
            setError(msg);
            toast.error(msg);
          }
        },
        modal: {
          ondismiss: function () {
            setError("Payment cancelled");
            toast.error("Payment cancelled");
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        const msg = response.error.description || "Payment failed";
        setError(msg);
        toast.error(msg);
        // close the modal explicitly in some configs, usually handled
      });

      rzp.open();
    } catch (err) {
      const msg = err.message || "Failed to initiate payment";
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const resetPayment = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    handleUpgrade,
    resetPayment,
    isLoading,
    error,
    success,
  };
};
