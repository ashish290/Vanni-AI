import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import icon from "../assets/icon.svg";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState("initializing");

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");

    const handleOAuth = async () => {
      if (!token) {
        toast.error("Social login failed. Please try again.");
        navigate("/login?error=oauth_failed");
        return;
      }

      try {
        setStatus("verifying");
        const data = await loginWithToken(token);
        if (data.success) {
          setStatus("success");
          const welcomeMsg = name ? `Welcome back, ${name}! 👋` : "Welcome back! 🎉";
          toast.success(welcomeMsg);
          // Small delay for smooth transition
          setTimeout(() => navigate("/chat"), 1000);
        } else {
          toast.error(data.error || "Authentication failed.");
          navigate("/login");
        }
      } catch (err) {
        toast.error("Something went wrong during social login.");
        navigate("/login");
      }
    };

    handleOAuth();
  }, [searchParams, navigate, loginWithToken]);

  const displayName = searchParams.get("name") || "Friend";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#FAFAF8] relative overflow-hidden text-[#1A1A2E]">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .anim-ring-pulse { animation: ringPulse 2.5s ease-out infinite; }
      `}</style>

      {/* Background decoration matching AuthPage */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Mascot Icon */}
        <div className="relative w-24 h-24 mb-8 anim-float">
          <div className="absolute inset-0 border-4 border-saffron-200/50 rounded-full anim-ring-pulse"></div>
          <div className="absolute inset-0 border-4 border-saffron-300/30 rounded-full anim-ring-pulse delay-700"></div>
          <div className="w-full h-full rounded-full overflow-hidden shadow-2xl shadow-saffron-200 border-4 border-white relative z-10">
            <img
              src={icon}
              alt="Vanni AI"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="font-baloo text-3xl font-bold tracking-tight text-gray-900">
            {status === "success" ? "All set! 🚀" : `Namaste, ${displayName}! 🙏`}
          </h1>
          <p className="font-hind text-lg text-gray-500 font-medium">
            {status === "success" 
              ? "Taking you to your chat room..." 
              : "Connecting you to your personalized tutor..."}
          </p>
          
          {/* Custom Spinner */}
          <div className="flex justify-center pt-4">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-saffron-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
