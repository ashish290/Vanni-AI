import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../services/api";
import toast from "react-hot-toast";
import icon from "../assets/icon.svg";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";

export default function AuthPage({ initialView = "login" }) {
  const [isLoginView, setIsLoginView] = useState(initialView === "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("beginner");

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [emptyFields, setEmptyFields] = useState([]);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Speech bubble logic
  const speechTexts = [
    "Namaste! 🙏",
    "Let's learn English!",
    "Main hoon Vanni! 😊",
    "Aao seekhein! 🎓",
  ];
  const [speechIdx, setSpeechIdx] = useState(0);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoginView(initialView === "login");
  }, [initialView, location.pathname]);


  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const strengthInfo = useMemo(() => {
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    score = Math.min(score, 4);

    const labels = ["Weak 😕", "OK 😐", "Good 👍", "Strong 💪", "Strong 💪"];
    const colors = [
      "bg-red-500",
      "bg-yellow-400",
      "bg-blue-400",
      "bg-green-500",
      "bg-green-500",
    ];

    return {
      score,
      label: labels[score] || "",
      color: colors[score] || "bg-gray-200",
    };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitStatus("idle");
    setEmptyFields([]);

    const empty = [];
    if (!isLoginView && !name.trim()) empty.push("name");
    if (!email.trim()) empty.push("email");
    if (!password) empty.push("password");

    if (empty.length > 0) {
      setEmptyFields(empty);
      setSubmitStatus("error");
      setTimeout(() => setEmptyFields([]), 600);
      return;
    }

    if (!isLoginView && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setEmptyFields(["password"]);
      setSubmitStatus("error");
      setTimeout(() => setEmptyFields([]), 600);
      return;
    }

    setIsSubmitting(true);

    try {
      let data;
      if (isLoginView) {
        data = await login(email, password);
      } else {
        data = await register(name, email, password, level);
      }

      if (data && data.success) {
        setSubmitStatus("success");
        setTimeout(() => {
          navigate("/chat");
        }, 2000);
      } else {
        const msg = data?.error || "Authentication failed.";
        toast.error(msg);
        setSubmitStatus("error");
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error("Something went wrong.");
      setSubmitStatus("error");
      setIsSubmitting(false);
    }
  };


  const toggleView = (view) => {
    if (
      (view === "login" && isLoginView) ||
      (view === "register" && !isLoginView)
    )
      return;
    setIsLoginView(!isLoginView);
    setSubmitStatus("idle");
    setEmptyFields([]);
    setName("");
    setEmail("");
    setPassword("");
    navigate(isLoginView ? "/register" : "/login", { replace: true });
  };

  const goHome = () => navigate("/");

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <div className="flex w-full h-[100dvh] overflow-hidden bg-[#FAFAF8] text-[#1A1A2E]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Hind:wght@400;500;600;700&display=swap');

        .font-baloo { font-family: 'Baloo 2', cursive; }
        .font-hind { font-family: 'Hind', sans-serif; }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(0.95); }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        .anim-wave { transform-origin: bottom right; animation: wave 1.5s ease-in-out infinite; }

        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .anim-ring-pulse { animation: ringPulse 2.5s ease-out infinite; }

        @keyframes bubbleFade {
          0% { opacity: 0; transform: translateY(4px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }

        @keyframes pulseHeartbeat {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.4); transform: scale(1); }
          50% { box-shadow: 0 0 0 6px rgba(255, 107, 53, 0); transform: scale(1.01); }
        }

        @keyframes authShimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          20%, 100% { transform: translateX(200%) skewX(-15deg); }
        }

        @keyframes inputShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .anim-shake { animation: inputShake 0.4s ease-in-out; border-color: #E74C3C !important; }

        @keyframes successBounce {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes confettiFall {
          0% { transform: translateY(-50px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes staggerFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Floating Inputs */
        .auth-input-group:focus-within .auth-label, .auth-input-group.has-val .auth-label {
          transform: translateY(-16px) scale(0.75) translateX(-8px);
          color: #FF6B35;
          opacity: 1;
        }
        .auth-label { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .auth-input { transition: all 0.2s ease-in-out; }
        .auth-input:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
        }

        /* Hide Scrollbar */
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ==================== LEFT SIDE: BRAND PANEL ==================== */}
      <div
        className="hidden md:flex flex-col relative w-1/2 h-full bg-gradient-to-br from-[#FF6B35] to-[#1B4F72] overflow-hidden"
        style={{
          animation: "slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Decorative Grid & Orbs */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div
          className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-white rounded-full blur-[100px] opacity-10"
          style={{ animation: "floatSlow 20s infinite ease-in-out" }}
        ></div>
        <div
          className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#FFB085] rounded-full blur-[90px] opacity-15"
          style={{ animation: "floatReverse 15s infinite ease-in-out" }}
        ></div>

        {/* Center Content */}
        <div className="m-auto flex flex-col items-center justify-center relative z-10 w-full max-w-sm px-8">
          {/* TOP: Mascot & Logo */}
          <button
            onClick={goHome}
            title="Go to Home 🏠"
            className="group flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300 outline-none"
          >
            <div className="relative w-[100px] h-[100px] mb-5">
              <div className="absolute inset-2 border-2 border-white/20 rounded-full anim-ring-pulse"></div>
              <div
                className="absolute inset-2 border-2 border-saffron-300/30 rounded-full anim-ring-pulse"
                style={{ animationDelay: "1.25s" }}
              ></div>
              <img
                src={icon}
                alt="Vanni AI Logo"
                className="w-full h-full drop-shadow-md relative z-10 anim-wave rounded-full object-cover"
              />
            </div>

            <h1 className="font-baloo font-[800] text-[42px] text-white leading-none tracking-tight">
              Vanni AI
            </h1>
            <p className="font-hind text-white/70 text-[16px] italic mt-1 font-medium">
              Apni Awaaz, Apna English
            </p>
          </button>

          {/* MIDDLE: 3 Highlights */}
          <div className="mt-10 flex flex-col gap-3 w-full items-center">
            {[
              { icon: "✨", text: "AI-Powered Tutor", delay: "0.2s" },
              { icon: "🎤", text: "Voice + Text Mode", delay: "0.3s" },
              { icon: "🧠", text: "Remembers Your Mistakes", delay: "0.4s" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-full py-2.5 px-5 border border-white/20 text-white font-hind font-medium text-[15px] flex items-center gap-3 w-fit"
                style={{
                  animation: `slideInLeft 0.5s forwards ${feature.delay}`,
                  opacity: 0,
                  transform: "translateX(-20px)",
                }}
              >
                <span className="text-xl leading-none">{feature.icon}</span>{" "}
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: Social Proof */}
        <div
          className="pb-8 pt-4 w-full text-center relative z-10"
          style={{ animation: "slideInLeft 0.5s forwards 0.5s", opacity: 0 }}
        >
          <p className="text-white/80 font-hind font-medium text-sm tracking-wide">
            🇮🇳 <span className="font-bold text-white">50,000+</span> Indian
            students learning
          </p>
        </div>
      </div>

      {/* ==================== RIGHT SIDE: FORM PANEL ==================== */}
      <div
        className="flex w-full md:w-1/2 h-full bg-[#FAFAF8] relative flex-col items-center p-6 sm:px-12 md:rounded-l-[32px] md:-ml-6 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] overflow-y-auto"
        style={{
          animation: "slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.03)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="w-full max-w-[380px] relative z-10 my-auto pt-8 pb-12">
          {/* SUCCESS OVERLAY */}
          {submitStatus === "success" && (
            <div className="absolute inset-[-40px] bg-[#FAFAF8]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center rounded-[24px]">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-sm ${["bg-saffron-500", "bg-turmeric-500", "bg-green-500", "bg-navy-500", "bg-red-400", "bg-purple-400"][i % 6]}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-10px`,
                    animation: `confettiFall ${1 + Math.random()}s ease-in forwards ${Math.random() * 0.5}s`,
                  }}
                />
              ))}
              <div
                className="w-[80px] h-[80px] bg-green-100 rounded-full flex items-center justify-center text-[40px] text-green-500 mb-4 shadow-sm"
                style={{
                  animation:
                    "successBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                }}
              >
                ✓
              </div>
              <h2
                className="font-baloo text-2xl font-bold text-[#1A1A2E] mb-1"
                style={{
                  animation: "staggerFadeUp 0.4s forwards 0.2s",
                  opacity: 0,
                }}
              >
                {isLoginView ? "Welcome Back! 🎉" : "Welcome to Vanni! 🎊"}
              </h2>
              <div
                className="flex items-center gap-2 mt-4 text-[#888] font-hind font-medium text-[15px]"
                style={{
                  animation: "staggerFadeUp 0.4s forwards 0.3s",
                  opacity: 0,
                }}
              >
                <div className="w-4 h-4 border-2 border-saffron-200 border-t-saffron-500 rounded-full animate-spin"></div>
                Redirecting...
              </div>
            </div>
          )}

          {/* TOP: Speech Bubble */}
          <div className="flex justify-center mb-3">
            <div
              className="w-[140px] text-center"
              style={{ animation: "bubbleFade 2.5s infinite" }}
            >
              <div className="bg-gradient-to-r from-saffron-400 to-[#E55A2B] text-white font-baloo font-bold px-3 py-1 rounded-full shadow-sm text-[12px] whitespace-nowrap">
                {speechTexts[speechIdx]}
              </div>
            </div>
          </div>

          <div
            className="text-center mb-5"
            style={{
              animation: "staggerFadeUp 0.3s forwards 0.1s",
              opacity: 0,
            }}
          >
            <h2 className="font-baloo font-[800] text-[28px] text-[#1A1A2E] leading-tight">
              {isLoginView ? "Wapas Aaye! 👋" : "Shuru Karte Hain! 🚀"}
            </h2>
            <p className="font-hind text-[14px] text-[#888] mt-0.5 font-medium">
              {isLoginView
                ? "Apne account mein login karo"
                : "Apna free account banao aaj hi"}
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div
            className="bg-[#F0F0F0] p-1.5 rounded-full flex mb-5 relative w-full"
            style={{
              animation: "staggerFadeUp 0.3s forwards 0.15s",
              opacity: 0,
            }}
          >
            <div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out z-0"
              style={{ left: isLoginView ? "6px" : "calc(50% + 0px)" }}
            ></div>
            <button
              onClick={() => toggleView("login")}
              className={`flex-1 py-1.5 font-baloo font-bold text-[14px] z-10 rounded-full transition-colors ${isLoginView ? "text-saffron-600" : "text-[#888] hover:text-[#555]"}`}
            >
              🔑 Login
            </button>
            <button
              onClick={() => toggleView("register")}
              className={`flex-1 py-1.5 font-baloo font-bold text-[14px] z-10 rounded-full transition-colors ${!isLoginView ? "text-saffron-600" : "text-[#888] hover:text-[#555]"}`}
            >
              ✨ Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* OAUTH BUTTONS */}
              <div
                className="flex flex-col gap-2 mb-1"
                style={{
                  animation: "staggerFadeUp 0.3s forwards 0.15s",
                  opacity: 0,
                }}
              >
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-[48px] bg-white border-[1.5px] border-[#E0E0E0] rounded-[12px] flex items-center justify-center gap-3 hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 outline-none group"
                >
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  <span className="font-hind font-semibold text-[#3C4043] text-[15px] group-hover:text-black">
                    Continue with Google
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubLogin}
                  className="w-full h-[48px] bg-[#24292E] text-white rounded-[12px] flex items-center justify-center gap-3 hover:bg-[#2F363D] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 outline-none"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                  </svg>
                  <span className="font-hind font-semibold text-[15px]">
                    Continue with GitHub
                  </span>
                </button>
              </div>

              <div
                className="flex items-center gap-3 my-1"
                style={{
                  animation: "staggerFadeUp 0.3s forwards 0.2s",
                  opacity: 0,
                }}
              >
                <div className="flex-1 h-px bg-[#E8E8E8]"></div>
                <span className="text-[11px] font-baloo font-bold text-[#A0A0A0] uppercase tracking-widest">
                  email
                </span>
                <div className="flex-1 h-px bg-[#E8E8E8]"></div>
              </div>

              {!isLoginView && (
                <div
                  className={`auth-input-group relative h-[52px] ${name ? "has-val" : ""}`}
                  style={{
                    animation: "staggerFadeUp 0.3s forwards 0.2s",
                    opacity: 0,
                  }}
                >
                  <div className="absolute left-4 top-[14px] text-gray-400 z-10 text-[18px]">
                    👤
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className={`auth-input w-full h-full pl-11 pr-4 pt-[18px] pb-1 border-2 rounded-[14px] font-hind font-semibold text-[#1A1A2E] bg-white outline-none text-[15px] ${emptyFields.includes("name") ? "anim-shake" : "border-[#E8E8E8]"}`}
                  />
                  <label className="auth-label absolute left-11 top-[15px] text-[#888] font-hind font-medium pointer-events-none transform origin-left text-[14px]">
                    Aapka Naam
                  </label>
                </div>
              )}

              <div
                className={`auth-input-group relative h-[52px] ${email ? "has-val" : ""}`}
                style={{
                  animation: `staggerFadeUp 0.3s forwards ${isLoginView ? "0.2s" : "0.25s"}`,
                  opacity: 0,
                }}
              >
                <div className="absolute left-4 top-[14px] text-gray-400 z-10 text-[18px]">
                  📧
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`auth-input w-full h-full pl-11 pr-10 pt-[18px] pb-1 border-2 rounded-[14px] font-hind font-semibold text-[#1A1A2E] bg-white outline-none text-[15px] ${emptyFields.includes("email") ? "anim-shake" : "border-[#E8E8E8]"}`}
                />
                <label className="auth-label absolute left-11 top-[15px] text-[#888] font-hind font-medium pointer-events-none transform origin-left text-[14px]">
                  Email Address
                </label>
                {validateEmail(email) && (
                  <div
                    className="absolute right-4 top-[15px] text-green-500 text-[16px]"
                    style={{ animation: "successBounce 0.3s forwards" }}
                  >
                    ✅
                  </div>
                )}
              </div>

              <div
                className="flex flex-col gap-1.5 relative"
                style={{
                  animation: `staggerFadeUp 0.3s forwards ${isLoginView ? "0.25s" : "0.3s"}`,
                  opacity: 0,
                }}
              >
                <div
                  className={`auth-input-group relative h-[52px] ${password ? "has-val" : ""}`}
                >
                  <div className="absolute left-4 top-[14px] text-gray-400 z-10 text-[18px]">
                    🔒
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`auth-input w-full h-full pl-11 pr-11 pt-[18px] pb-1 border-2 rounded-[14px] font-hind font-semibold text-[#1A1A2E] bg-white outline-none text-[15px] ${!showPassword && password ? "tracking-widest" : ""} ${emptyFields.includes("password") ? "anim-shake" : "border-[#E8E8E8]"}`}
                  />
                  <label className="auth-label absolute left-11 top-[15px] text-[#888] font-hind font-medium pointer-events-none transform origin-left text-[14px]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[14px] p-0 text-[#888] hover:text-saffron-500 transition-colors text-[18px] outline-none"
                    tabIndex="-1"
                  >
                    {showPassword ? "🫣" : "👁️"}
                  </button>
                </div>

                {/* Password Extras */}
                <div className="flex justify-between items-center px-1">
                  {!isLoginView ? (
                    <div className="flex items-center gap-2 flex-1 mt-0.5">
                      <div className="flex gap-1 flex-1 max-w-[120px]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div
                            key={s}
                            className={`h-[5px] flex-1 rounded-full ${s <= strengthInfo.score ? strengthInfo.color : "bg-[#E8E8E8]"}`}
                          ></div>
                        ))}
                      </div>
                      <span className="text-[11px] font-hind font-bold text-[#888]">
                        {strengthInfo.label}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full text-right mt-1">
                      <button
                        type="button"
                        onClick={() => setIsForgotModalOpen(true)}
                        className="text-[12px] font-baloo font-bold text-saffron-500 hover:text-saffron-600 transition-colors"
                      >
                        Forgot password? 🤔
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* LEVEL SELECTOR */}
              {!isLoginView && (
                <div
                  className="mt-1"
                  style={{
                    animation: "staggerFadeUp 0.3s forwards 0.35s",
                    opacity: 0,
                  }}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: "beginner",
                        icon: "🌱",
                        label: "Beginner",
                        sub: "Naya",
                      },
                      {
                        id: "intermediate",
                        icon: "🔥",
                        label: "Inter...",
                        sub: "Thoda aata",
                      },
                      {
                        id: "advanced",
                        icon: "🚀",
                        label: "Advanced",
                        sub: "Polish karo",
                      },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLevel(l.id)}
                        className={`relative p-2 rounded-[12px] border flex flex-col items-center text-center transition-all duration-300 outline-none ${
                          level === l.id
                            ? "border-saffron-500 bg-saffron-50/50 transform scale-[1.03] shadow-sm z-10"
                            : "border-[#E8E8E8] bg-white hover:border-saffron-200"
                        }`}
                      >
                        {level === l.id && (
                          <div
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-saffron-500 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white z-10 shadow-sm"
                            style={{ animation: "successBounce 0.2s forwards" }}
                          >
                            ✓
                          </div>
                        )}
                        <span className="text-[22px] mb-0.5 leading-none">
                          {l.icon}
                        </span>
                        <span
                          className={`text-[12px] font-baloo font-bold leading-tight ${level === l.id ? "text-saffron-600" : "text-[#1A1A2E]"}`}
                        >
                          {l.label}
                        </span>
                        <span className="text-[10px] font-hind text-[#888] leading-none mt-0.5">
                          {l.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <div
                className="mt-3"
                style={{
                  animation: `staggerFadeUp 0.3s forwards ${isLoginView ? "0.3s" : "0.4s"}`,
                  opacity: 0,
                }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`relative w-full h-[50px] rounded-[14px] font-baloo font-bold text-[16px] text-white transition-all duration-300 overflow-hidden group outline-none tracking-wide ${
                    !isSubmitting
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#E55A25] hover:-translate-y-px hover:shadow-[0_8px_16px_rgba(255,107,53,0.3)] active:scale-[0.97]"
                      : "bg-[#D1D1D1] text-[#888] cursor-not-allowed"
                  }`}
                  style={
                    !isSubmitting
                      ? { animation: "pulseHeartbeat 2.5s infinite" }
                      : {}
                  }
                >
                  {!isSubmitting && (
                    <div
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-15deg] group-hover:hidden"
                      style={{ animation: "authShimmer 3s infinite" }}
                    ></div>
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2 h-full">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#888]/30 border-t-[#888] rounded-full animate-spin"></div>
                        Please wait...
                      </>
                    ) : isLoginView ? (
                      "Login Karo! 🚀"
                    ) : (
                      "Register Karo! 🎉"
                    )}
                  </span>
                </button>
              </div>
            </form>

          {/* BOTTOM LINKS */}
          <div
            style={{
              animation: `staggerFadeUp 0.3s forwards ${isLoginView ? "0.35s" : "0.45s"}`,
              opacity: 0,
            }}
            className="mt-4"
          >
            <div className="text-center mb-4">
              <button
                onClick={() => toggleView(isLoginView ? "register" : "login")}
                className="text-[14px] font-hind font-medium text-[#888] hover:text-[#1A1A2E] transition-colors outline-none"
              >
                {isLoginView ? (
                  <>
                    Naya user?{" "}
                    <span className="text-[#FF6B35] font-bold underline decoration-saffron-200 underline-offset-4 pointer-events-none">
                      Register karo →
                    </span>
                  </>
                ) : (
                  <>
                    Already registered?{" "}
                    <span className="text-[#FF6B35] font-bold underline decoration-saffron-200 underline-offset-4 pointer-events-none">
                      Login karo →
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-center items-center gap-4">
              {["🔒 Secure", "🇮🇳 Made in India", "⭐ 4.8 Rating"].map(
                (badge, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-hind font-bold text-[#A0A0A0] flex items-center gap-1"
                  >
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
}
