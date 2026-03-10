import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const handleOAuth = async () => {
      if (token) {
        try {
          const data = await loginWithToken(token);
          if (data.success) {
            navigate("/chat");
          } else {
            toast.error("Authentication failed. Please try again.");
            navigate("/login");
          }
        } catch (err) {
          toast.error("Something went wrong during social login.");
          navigate("/login");
        }
      } else {
        toast.error("Social login failed. Please try with Email.");
        navigate("/login?error=oauth_failed");
      }
    };

    handleOAuth();
  }, [navigate, loginWithToken]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FF6B35, #1B4F72)",
        fontFamily: "'Baloo 2', cursive",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "5px solid rgba(255,255,255,0.3)",
          borderTopColor: "white",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          color: "white",
          marginTop: 20,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        Logging you in... 🚀
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
