import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import icon from "../assets/icon.svg";

// Custom hook for scroll animations
const useIntersectionObserver = (options = {}) => {
  const [elements, setElements] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observedEntries) => {
        setEntries((prev) => {
          const newEntries = [...prev];
          observedEntries.forEach((entry) => {
            const index = newEntries.findIndex(
              (e) => e.target === entry.target,
            );
            if (index !== -1) {
              newEntries[index] = entry;
            } else {
              newEntries.push(entry);
            }
          });
          return newEntries;
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px", ...options },
    );

    elements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [elements, options]);

  return [setElements, entries];
};

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  animation = "fade-up-enter",
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0"
      } ${
        !isVisible && animation === "fade-up-enter" ? "translate-y-12" : ""
      } ${
        !isVisible && animation === "fade-left-enter" ? "translate-x-12" : ""
      } ${
        !isVisible && animation === "fade-right-enter" ? "-translate-x-12" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function Landing() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeLevel, setActiveLevel] = useState(null);

  // Hero Speech Bubble Logic
  const heroMessages = [
    "Namaste! 🙏",
    "Let's learn English!",
    "Main hoon Vanni! 😊",
  ];
  const [heroMessageIdx, setHeroMessageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroMessageIdx((prev) => (prev + 1) % heroMessages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Testimonials Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: "Kya main Hindi mein baat kar sakta hoon?",
      a: "Haan! Vanni AI Hinglish samajhti hai. Lekin dheere dheere English mein shift karana sikhayegi — yahi toh magic hai!",
    },
    {
      q: "Internet slow hai toh kya hoga?",
      a: "Text mode works on 2G also. Voice mode needs basic 4G. We're optimized for Indian networks.",
    },
    {
      q: "Kya yeh beginners ke liye bhi hai?",
      a: "Bilkul! Chahe A B C D se start karna ho — Vanni will never judge, always encourage.",
    },
    {
      q: "Payment safe hai?",
      a: "100% safe. We use Razorpay — India's most trusted payment gateway. UPI, cards, net banking sab accepted.",
    },
    {
      q: "Cancel kaise karo?",
      a: "One click cancel from your profile. No questions asked, no drama.",
    },
  ];

  return (
    <div className="landing-container min-h-screen bg-[#FAFAF8] text-gray-800 font-nunito overflow-x-hidden w-full relative">
      <style>{`
        /* Global & Reset */
        body { margin: 0; padding: 0; background: #FAFAF8; }
        
        /* Typography */
        .landing-title { font-family: 'Poppins', sans-serif; font-weight: 800; line-height: 1.1; }
        .landing-subtitle { font-family: 'Nunito', sans-serif; }
        
        /* Master Animations */
        @keyframes heroWordBounce {
          0% { transform: translateY(20px); opacity: 0; }
          60% { transform: translateY(-5px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes mascotWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-5deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes typeWriter {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blinkMenu {
          50% { border-color: transparent }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes popUp {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes floatEmojiUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pulseButton {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(255, 107, 53, 0); }
        }
        @keyframes spinIcon {
          100% { transform: rotate(360deg); }
        }
        
        /* Interaction Classes */
        .l-btn { 
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
          display: inline-flex; justify-content: center; items-center; font-weight: 700;
        }
        .l-btn:hover { transform: scale(1.05); filter: brightness(1.05); }
        .l-btn:active { transform: scale(0.95); }
        
        .l-btn-primary {
          background-color: #FF6B35;
          color: white;
          box-shadow: 0 4px 14px 0 rgba(255,107,53,0.39);
        }
        .l-btn-secondary {
          background-color: transparent;
          color: #FF6B35;
          border: 2px solid #FF6B35;
        }

        /* Elements */
        .word-bounce { display: inline-block; opacity: 0; animation: heroWordBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .mascot { animation: floatSlow 4s ease-in-out infinite; }
        .mascot-arm { transform-origin: bottom right; animation: mascotWave 2s ease-in-out infinite; }
        .speech-bubble-text { 
          display: inline-block; 
          overflow: hidden; 
          white-space: nowrap; 
          animation: typeWriter 1.5s steps(20, end) forwards, blinkMenu 0.75s step-end infinite; 
          border-right: 2px solid #FF6B35;
        }

        .marquee-track {
          display: flex;
          width: 200%;
          animation: marquee 20s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }

        .pricing-card.popular {
          transform: scale(1.05);
          border: 2px solid #FF6B35;
          z-index: 10;
        }
        @media(max-width: 768px) {
          .pricing-card.popular { transform: scale(1); }
        }

        .level-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); cursor: pointer; }
        .level-card:hover { transform: translateY(-5px) rotate(1deg); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        .level-card.active { border-color: #FF6B35; background-color: #FFF5EE; animation: popUp 0.4s ease-out; }

        .faq-content { transition: max-height 0.3s ease-in-out, opacity 0.3s ease; max-height: 0; opacity: 0; overflow: hidden; }
        .faq-content.open { max-height: 200px; opacity: 1; }
        
        /* Layout Specifics */
        .section-padding { padding: 4rem 1.5rem; }
        @media(min-width: 768px) { .section-padding { padding: 6rem 3rem; } }
      `}</style>

      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
              <img
                src={icon}
                alt="Vanni AI"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-poppins font-bold text-xl text-[#1B4F72]">
              Vanni AI
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 font-bold text-[#1B4F72] hover:bg-gray-50 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl font-bold bg-[#FF6B35] text-white hover:bg-[#E55A2B] shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* SECTION 1 - HERO */}
      <section className="relative pt-28 pb-16 min-h-[90vh] flex items-center bg-gradient-to-br from-[#FFD0AD]/20 via-[#FAFAF8] to-[#1B4F72]/10 overflow-hidden">
        {/* Background Particles Container */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute w-64 h-64 bg-saffron-300/20 rounded-full blur-3xl top-10 left-10 animate-[floatSlow_8s_ease-in-out_infinite]"></div>
          <div className="absolute w-80 h-80 bg-navy-300/10 rounded-full blur-3xl bottom-10 right-10 animate-[floatSlow_10s_ease-in-out_infinite_reverse]"></div>
          {/* Emojis */}
          {["🎓", "📚", "✨", "🌟", "💬", "🗣️"].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-40 mix-blend-multiply"
              style={{
                left: `${15 + i * 15}%`,
                animation: `floatEmojiUp ${10 + i * 2}s linear infinite ${i * 1.5}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 w-full relative z-10 grid md:grid-cols-2 gap-10 items-center">
          {/* Left Text */}
          <div className="text-center md:text-left order-2 md:order-1 pt-4 md:pt-0">
            <AnimatedSection delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron-100 text-saffron-700 font-bold text-sm mb-6 border border-saffron-200 shadow-sm">
                <span>🇮🇳</span>
                <span>Made for Bharat</span>
              </div>
            </AnimatedSection>

            <h1 className="landing-title text-[40px] md:text-6xl text-navy-800 mb-6 leading-[1.15]">
              {"English Seekho,".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="word-bounce block md:inline"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {word}&nbsp;
                </span>
              ))}
              <br className="hidden md:block" />
              {"Aage Badho!".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="word-bounce text-saffron-500 block md:inline"
                  style={{ animationDelay: `${400 + i * 150}ms` }}
                >
                  {word}&nbsp;
                </span>
              ))}
            </h1>

            <AnimatedSection delay={800}>
              <p className="text-xl text-gray-600 mb-8 font-nunito max-w-lg mx-auto md:mx-0">
                Vanni AI ke saath — your personal English tutor who speaks{" "}
                <strong className="text-navy-600">YOUR</strong> language 😊
              </p>
            </AnimatedSection>

            <AnimatedSection delay={1000}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="l-btn l-btn-primary px-8 py-4 rounded-2xl text-lg shadow-[0_8px_20px_-6px_rgba(255,107,53,0.5)]"
                >
                  Seekhna Shuru Karo! 🚀
                </Link>
                <a
                  href="#how-it-works"
                  className="l-btn l-btn-secondary px-8 py-4 rounded-2xl text-lg hover:bg-saffron-50"
                >
                  Dekho Kaise Kaam Karta Hai →
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={1200}>
              <div className="mt-8 flex items-center justify-center md:justify-start gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=d1d5db`}
                        alt="user"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-navy-100 flex items-center justify-center text-xs font-bold text-navy-600 shadow-sm">
                    +
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-600">
                  <span className="text-saffron-600 font-bold block">
                    50,000+ students
                  </span>
                  already learning
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Mascot */}
          <div className="relative order-1 md:order-2 flex justify-center pt-8 md:pt-0">
            <AnimatedSection delay={500} animation="fade-left-enter">
              {/* Speech Bubble */}
              <div className="absolute -top-12 md:-top-16 left-1/2 md:left-20 -translate-x-1/2 md:translate-x-0 bg-white px-5 py-3 rounded-2xl shadow-xl z-20 border border-gray-100 min-w-[200px] text-center">
                <p
                  className="font-poppins font-bold text-navy-600 speech-bubble-text text-lg"
                  key={heroMessageIdx}
                >
                  {heroMessages[heroMessageIdx]}
                </p>
                {/* Bubble tail */}
                <div className="absolute -bottom-3 left-1/2 md:left-10 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
              </div>

              {/* SVG Mascot */}
              <div className="mascot w-64 h-64 md:w-80 md:h-80 relative z-10 mt-8">
                <svg
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-2xl"
                >
                  {/* Body Circle */}
                  <circle cx="100" cy="110" r="70" fill="#F4A300" />

                  {/* Belly */}
                  <circle cx="100" cy="125" r="45" fill="#FFE8D6" />

                  {/* Eyes Area */}
                  <rect
                    x="50"
                    y="70"
                    width="100"
                    height="50"
                    rx="25"
                    fill="white"
                  />
                  <circle cx="70" cy="95" r="10" fill="#1B4F72" />
                  <circle cx="130" cy="95" r="10" fill="#1B4F72" />

                  {/* Sparkle in eyes */}
                  <circle cx="73" cy="92" r="3" fill="white" />
                  <circle cx="133" cy="92" r="3" fill="white" />

                  {/* Blush */}
                  <circle cx="45" cy="110" r="8" fill="#FF8F52" opacity="0.6" />
                  <circle
                    cx="155"
                    cy="110"
                    r="8"
                    fill="#FF8F52"
                    opacity="0.6"
                  />

                  {/* Beak */}
                  <path
                    d="M100 115 L90 100 L110 100 Z"
                    fill="#FF6B35"
                    stroke="#E55A2B"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />

                  {/* Left Wing (static) */}
                  <path
                    d="M30 110 Q10 140 35 150 Q45 130 50 120"
                    fill="#D48E00"
                  />

                  {/* Right Wing (Waving Arm) */}
                  <g
                    className="mascot-arm"
                    style={{ transformOrigin: "150px 120px" }}
                  >
                    <path
                      d="M170 110 Q190 80 165 70 Q155 90 150 120"
                      fill="#D48E00"
                    />
                    {/* Waving lines */}
                    <path
                      d="M185 75 Q195 80 190 90"
                      stroke="#FF8F52"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M175 65 Q185 70 180 80"
                      stroke="#FF8F52"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </g>

                  {/* Head feathers */}
                  <path
                    d="M80 45 Q100 25 100 40 Q100 25 120 45"
                    stroke="#F4A300"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M80 45 Q100 25 100 40 Q100 25 120 45"
                    stroke="#D48E00"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    transform="translate(0, 5)"
                  />
                </svg>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 2 - SOCIAL PROOF BAR */}
      <section className="bg-[#0D1B2A] py-4 overflow-hidden border-y-4 border-saffron-500 relative flex items-center shadow-inner">
        <div className="absolute left-0 w-8 md:w-20 h-full bg-gradient-to-r from-[#0D1B2A] to-transparent z-10"></div>
        <div className="absolute right-0 w-8 md:w-20 h-full bg-gradient-to-l from-[#0D1B2A] to-transparent z-10"></div>
        <div className="marquee-track flex whitespace-nowrap">
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-8 px-4 items-center">
              <span className="text-white/90 font-bold text-lg">
                ⭐ Ravi from Patna improved in 30 days
              </span>
              <span className="text-saffron-500 text-xl font-bold">•</span>
              <span className="text-white/90 font-bold text-lg">
                🎯 Priya from Nagpur got her dream job
              </span>
              <span className="text-saffron-500 text-xl font-bold">•</span>
              <span className="text-white/90 font-bold text-lg">
                🚀 Amit from Lucknow now speaks fluently
              </span>
              <span className="text-saffron-500 text-xl font-bold">•</span>
              <span className="text-white/90 font-bold text-lg">
                💬 Sunita from Jaipur aced her interview
              </span>
              <span className="text-saffron-500 text-xl font-bold">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 - HOW IT WORKS */}
      <section id="how-it-works" className="section-padding bg-white relative">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="landing-title text-3xl md:text-5xl text-navy-800 mb-4">
                Kaise Kaam Karta Hai? 🤔
              </h2>
              <p className="text-xl text-gray-500 font-bold">
                3 simple steps, zero confusion
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 relative mt-16">
            {/* Desktop Connectors */}
            <div className="hidden md:block absolute top-[10%] left-[20%] w-[60%] h-1 bg-gray-100 z-0">
              <div className="w-full h-full border-t-4 border-dashed border-gray-200"></div>
            </div>

            {/* Steps */}
            {[
              {
                num: 1,
                icon: "🎯",
                title: "Choose Your Level",
                text: "Beginner, Intermediate, ya Advanced — apna level choose karo",
                visual: (
                  <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center text-3xl animate-[spinIcon_4s_linear_infinite]">
                    🎯
                  </div>
                ),
              },
              {
                num: 2,
                icon: "💬",
                title: "Talk with Vanni AI",
                text: "Vanni AI se English mein baat karo — text ya voice, jo comfortable lage",
                visual: (
                  <div className="space-y-2 w-full max-w-[120px]">
                    <div className="bg-gray-200 rounded-xl rounded-bl-none h-6 w-3/4 ml-0 animate-[popUp_1s_ease-out_infinite_alternate]"></div>
                    <div className="bg-saffron-500 rounded-xl rounded-br-none h-6 w-full ml-auto animate-[popUp_1s_ease-out_infinite_alternate_reverse]"></div>
                  </div>
                ),
              },
              {
                num: 3,
                icon: "📈",
                title: "Track Your Progress",
                text: "Apni mistakes dekho, new words seekho, streak maintain karo!",
                visual: (
                  <div className="w-full max-w-[140px] bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-green-500 h-full w-[0%] rounded-full"
                      style={{ animation: "typeWriter 3s infinite" }}
                    ></div>
                  </div>
                ),
              },
            ].map((step, i) => (
              <AnimatedSection
                key={i}
                delay={i * 200}
                className="relative z-10 bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-gray-50 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="absolute -top-6 w-12 h-12 bg-[#1B4F72] text-white rounded-full flex items-center justify-center text-xl font-bold font-poppins shadow-lg border-4 border-white">
                  {step.num}
                </div>
                <div className="h-24 w-full flex items-center justify-center my-4">
                  {step.visual}
                </div>
                <h3 className="text-xl font-bold text-navy-800 mb-3 font-poppins">
                  {step.title}
                </h3>
                <p className="text-gray-600 font-nunito font-semibold leading-relaxed">
                  {step.text}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - FEATURES SHOWCASE */}
      <section className="section-padding bg-[#FAFAF8] overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <AnimatedSection
              animation="fade-right-enter"
              className="order-2 md:order-1 relative aspect-square max-h-[400px]"
            >
              <div className="absolute inset-0 bg-saffron-100 rounded-[3rem] transform rotate-3 scale-95"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl p-6 pb-0 flex flex-col overflow-hidden border border-gray-100">
                <div className="flex-1 space-y-4 pt-4">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-navy-500 flex-shrink-0 flex items-center justify-center text-xs text-white mt-1">
                      V
                    </div>
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 font-medium">
                      Namaste! Kaise ho aaj yaar?
                    </div>
                  </div>
                  <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-saffron-500 flex-shrink-0 mt-1"></div>
                    <div className="bg-saffron-500 p-3 rounded-2xl text-white text-sm font-medium rounded-tr-none">
                      Main theek hoon. I am feeling little tired for work.
                    </div>
                  </div>
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-navy-500 flex-shrink-0 flex items-center justify-center text-xs text-white mt-1">
                      V
                    </div>
                    <div className="bg-green-50 p-3 rounded-2xl rounded-tl-none border border-green-200">
                      <p className="text-sm font-semibold text-green-700">
                        Almost perfect! Better to say: "I am feeling a little
                        tired from work."
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Daftar ka kaam sach mein thaka deta hai na? Rest karlo!
                        😊
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection
              animation="fade-left-enter"
              className="order-1 md:order-2"
            >
              <h2 className="landing-title text-3xl md:text-4xl text-navy-800 mb-6">
                Vanni Samjhti Hai Tumhari Baat 🧠
              </h2>
              <p className="text-lg text-gray-600 font-semibold mb-6">
                Hinglish mein bolo, English mein seekho. Vanni AI understands
                Indian context, cricket references, Bollywood examples — feels
                like talking to a dost, not a robot.
              </p>
            </AnimatedSection>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <AnimatedSection animation="fade-right-enter" className="order-1">
              <h2 className="landing-title text-3xl md:text-4xl text-navy-800 mb-6">
                Galtiyan? Koi Baat Nahi! 🙏
              </h2>
              <p className="text-lg text-gray-600 font-semibold mb-6">
                Vanni gently corrects your mistakes mid-conversation — no
                embarrassment, no lectures. Just natural learning like a best
                friend would teach.
              </p>
            </AnimatedSection>
            <AnimatedSection
              animation="fade-left-enter"
              className="order-2 relative aspect-square max-h-[400px]"
            >
              <div className="absolute inset-0 bg-turmeric-100 rounded-[3rem] transform -rotate-3 scale-95"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] shadow-xl flex items-center justify-center p-8 border border-gray-100">
                <div className="w-full">
                  <div className="relative mb-6 text-center">
                    <span className="text-2xl font-bold text-gray-400 line-through opacity-70">
                      I goed to market
                    </span>
                    <div className="absolute top-1/2 -mt-1 left-0 w-full h-[3px] bg-red-400 rounded-full transform -rotate-1 origin-center"></div>
                  </div>
                  <div className="bg-green-100 text-green-700 font-bold p-4 rounded-xl text-center text-xl flex items-center justify-center gap-3 animate-[popUp_2s_infinite]">
                    <span>I went to market</span>
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-sm">
                      ✓
                    </span>
                  </div>
                  <div className="mt-8 text-center text-gray-500 font-semibold text-sm">
                    In English, "go" ka past tense "went" hota hai! 👍
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <AnimatedSection
              animation="fade-right-enter"
              className="order-2 md:order-1 relative aspect-square max-h-[400px]"
            >
              <div className="absolute inset-0 bg-blue-100 rounded-[3rem] transform rotate-3 scale-95"></div>
              <div className="absolute inset-0 bg-[#0D1B2A] rounded-[3rem] shadow-xl flex items-center justify-center flex-col p-8 border-4 border-navy-700">
                <div className="w-24 h-24 bg-navy-600 rounded-full flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(255,107,53,0.3)] animate-pulse">
                  <svg
                    className="w-10 h-10 text-saffron-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                </div>
                <div className="flex gap-2 items-end h-16 w-full justify-center opacity-80">
                  <div
                    className="w-3 bg-saffron-500 rounded-full"
                    style={{
                      height: "30%",
                      animation: "floatSlow 1s infinite alternate 0.1s",
                    }}
                  ></div>
                  <div
                    className="w-3 bg-saffron-500 rounded-full"
                    style={{
                      height: "80%",
                      animation: "floatSlow 0.8s infinite alternate 0.4s",
                    }}
                  ></div>
                  <div
                    className="w-3 bg-saffron-500 rounded-full"
                    style={{
                      height: "100%",
                      animation: "floatSlow 1.2s infinite alternate 0.2s",
                    }}
                  ></div>
                  <div
                    className="w-3 bg-saffron-500 rounded-full"
                    style={{
                      height: "40%",
                      animation: "floatSlow 0.9s infinite alternate 0.5s",
                    }}
                  ></div>
                  <div
                    className="w-3 bg-saffron-500 rounded-full"
                    style={{
                      height: "70%",
                      animation: "floatSlow 1.1s infinite alternate 0.3s",
                    }}
                  ></div>
                </div>
                <p className="text-white mt-8 font-poppins font-bold tracking-widest text-sm uppercase opacity-50">
                  Listening...
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection
              animation="fade-left-enter"
              className="order-1 md:order-2"
            >
              <h2 className="landing-title text-3xl md:text-4xl text-navy-800 mb-6">
                Awaaz Se Seekho 🎤
              </h2>
              <p className="text-lg text-gray-600 font-semibold mb-6">
                Text mode ya voice mode — apni marzi. Speak in Indian English,
                Vanni AI sunegi aur jawab degi bilkul natural Indian voice mein.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 5 - LEVEL SELECTOR */}
      <section className="section-padding bg-[#FF6B35]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="landing-title text-3xl md:text-5xl text-white text-center mb-16 underline decoration-turmeric-400 decoration-4 underline-offset-8">
              Tumhara Level Kya Hai? 🎯
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                id: "beginner",
                emoji: "🌱",
                title: "Bilkul Naya Hoon",
                desc: "Basic English start karna chahta hoon",
                sub: "Simple words, patient teaching",
              },
              {
                id: "intermediate",
                emoji: "🔥",
                title: "Thoda Thoda Aata Hai",
                desc: "Fluent banana hai mujhe",
                sub: "Natural conversations, idioms",
                badge: "MOST POPULAR",
              },
              {
                id: "advanced",
                emoji: "🚀",
                title: "Confident Hona Chahta Hoon",
                desc: "Professional English master karna hai",
                sub: "Complex topics, presentations",
              },
            ].map((level, i) => (
              <AnimatedSection key={level.id} delay={i * 200}>
                <div
                  className={`relative p-8 rounded-3xl bg-white border-4 border-transparent flex flex-col items-center text-center level-card h-full ${activeLevel === level.id ? "active" : ""}`}
                  onClick={() => setActiveLevel(level.id)}
                >
                  {level.badge && (
                    <div className="absolute -top-4 bg-navy-700 text-white font-bold text-xs px-4 py-1.5 rounded-full animate-bounce">
                      {level.badge}
                    </div>
                  )}
                  {activeLevel === level.id && (
                    <div className="absolute top-4 right-4 text-green-500 text-2xl font-bold animate-[popUp_0.3s_ease-out]">
                      ✓
                    </div>
                  )}

                  <div className="text-6xl mb-6">{level.emoji}</div>
                  <h3 className="landing-title text-2xl text-navy-800 mb-3">
                    {level.title}
                  </h3>
                  <p className="text-gray-700 font-bold mb-4">{level.desc}</p>
                  <p className="text-sm text-gray-500 font-semibold mt-auto px-4 py-2 bg-gray-100 rounded-xl w-full">
                    {level.sub}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-12 text-center h-20 flex items-center justify-center">
            {activeLevel && (
              <AnimatedSection>
                <Link
                  to="/register"
                  className="l-btn l-btn-primary px-10 py-5 rounded-full text-xl shadow-xl bg-navy-800 text-white border-2 border-transparent hover:bg-navy-900 mx-auto"
                >
                  Shuru Karte Hain! →
                </Link>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 6 - TESTIMONIALS */}
      <section className="section-padding bg-[#0D1B2A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="landing-title text-3xl md:text-5xl text-saffron-400 mb-16">
              Unki Kahani,
              <br className="md:hidden" /> Tumhari Inspiration ⭐
            </h2>
          </AnimatedSection>

          <div className="relative h-[300px] md:h-[250px]">
            {[
              {
                q: "Pehle interview mein English bolte time haath kaanpte the. Ab confidently baat karta hoon. Vanni ne sach mein change kar diya meri life!",
                author: "Rahul S.",
                location: "Patna, Software Developer",
                initials: "RS",
              },
              {
                q: "Maine 3 apps try kiye the. Vanni AI ne 2 months mein woh kiya jo doosron ne 1 saal mein nahi kiya. Meri manager ne notice kiya mera improvement!",
                author: "Priya M.",
                location: "Nagpur, BPO Executive",
                initials: "PM",
              },
              {
                q: "Voice mode is the best feature. Ghar pe akele practice karo, koi judge nahi karta. Vanni is very patient and encouraging — like a real teacher!",
                author: "Aakash T.",
                location: "Lucknow, College Student",
                initials: "AT",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center
                    ${activeTestimonial === idx ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-12 z-0 pointing-events-none"}`}
              >
                <div className="flex gap-1 text-turmeric-400 text-2xl mb-6">
                  {"★★★★★".split("").map((star, i) => (
                    <span
                      key={i}
                      style={{ animationDelay: `${i * 100}ms` }}
                      className={
                        activeTestimonial === idx
                          ? "animate-[popUp_0.3s_forwards]"
                          : ""
                      }
                    >
                      {star}
                    </span>
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-nunito font-semibold leading-relaxed mb-8 max-w-2xl">
                  "{t.q}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center font-bold text-lg border-2 border-saffron-500">
                    {t.initials}
                  </div>
                  <div className="text-left">
                    <p className="font-poppins font-bold text-lg text-white">
                      {t.author}
                    </p>
                    <p className="text-gray-400 text-sm">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-12">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === i ? "bg-saffron-500 w-8" : "bg-gray-600"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 - PRICING */}
      <section className="section-padding bg-white relative">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="landing-title text-3xl md:text-5xl text-navy-800 mb-4">
                Simple Pricing, Bada Fayda 💰
              </h2>
              <p className="text-xl text-gray-500 font-bold">
                No hidden charges. Cancel anytime.
              </p>
            </div>

            {/* Toggle */}
            <div className="flex justify-center mb-16">
              <div className="bg-gray-100 rounded-xl p-1.5 flex items-center shadow-inner relative border border-gray-200">
                <div
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 z-0"
                  style={{ left: isYearly ? "calc(50% + 3px)" : "6px" }}
                ></div>
                <button
                  onClick={() => setIsYearly(false)}
                  className={`relative z-10 px-6 py-2.5 font-bold rounded-lg transition-colors min-w-[120px] ${!isYearly ? "text-navy-800" : "text-gray-500"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`relative z-10 px-6 py-2.5 font-bold rounded-lg transition-colors min-w-[120px] flex items-center gap-2 ${isYearly ? "text-navy-800" : "text-gray-500"}`}
                >
                  Yearly
                  <span className="text-[10px] bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full absolute -top-3 right-0 -rotate-6 animate-pulse">
                    Save 30%
                  </span>
                </button>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto pb-8">
            {/* Free */}
            <AnimatedSection delay={0}>
              <div className="bg-white rounded-3xl p-8 border-2 border-navy-100 shadow-lg text-center h-full flex flex-col">
                <h3 className="landing-title font-bold text-2xl text-gray-800 mb-2">
                  Free
                </h3>
                <div className="text-5xl font-black text-navy-800 mb-6 font-poppins">
                  ₹0
                  <span className="text-lg text-gray-500 font-normal">/mo</span>
                </div>
                <ul className="space-y-4 text-left font-semibold text-gray-600 mb-8 flex-1">
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> 50 messages per
                    day
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> Text mode
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> Basic progress
                    tracking
                  </li>
                  <li className="flex gap-3 items-start opacity-50">
                    <span className="text-red-400">❌</span> Voice mode
                  </li>
                  <li className="flex gap-3 items-start opacity-50">
                    <span className="text-red-400">❌</span> Detailed reports
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="l-btn l-btn-secondary w-full py-4 rounded-xl border-navy-600 text-navy-700 hover:bg-navy-50"
                >
                  Free Mein Shuru Karo
                </Link>
              </div>
            </AnimatedSection>

            {/* Basic */}
            <AnimatedSection delay={200} className="relative z-10">
              <div className="bg-gradient-to-br from-[#FFF5EE] to-white rounded-3xl p-8 shadow-2xl text-center pricing-card popular border-2 border-saffron-500 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 bg-saffron-500 text-white font-bold text-sm py-1 font-poppins tracking-wider uppercase">
                  Sabse Popular 🔥
                </div>
                <h3 className="landing-title font-bold text-2xl text-saffron-600 mt-4 mb-2">
                  Basic
                </h3>
                <div className="text-5xl font-black text-navy-800 font-poppins mb-2">
                  ₹{isYearly ? "69" : "99"}
                  <span className="text-lg text-gray-500 font-normal">/mo</span>
                </div>
                <p className="text-sm text-saffron-600 font-bold mb-6 bg-saffron-100 rounded-full px-3 py-1 inline-block mx-auto">
                  Less than a chai-samosa a day! ☕
                </p>
                <ul className="space-y-4 text-left font-semibold text-gray-800 mb-8 flex-1">
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> 200 messages per
                    day
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> Text + Voice mode
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> Mistake tracking
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> Progress reports
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-500">✅</span> Priority support
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="l-btn l-btn-primary w-full py-4 rounded-xl"
                  style={{ animation: "pulseButton 2s infinite" }}
                >
                  Basic Lo! 🚀
                </Link>
              </div>
            </AnimatedSection>

            {/* Pro */}
            <AnimatedSection delay={400}>
              <div className="bg-[#0D1B2A] rounded-3xl p-8 border-2 border-[#0D1B2A] shadow-xl text-center h-full flex flex-col">
                <h3 className="landing-title font-bold text-2xl text-turmeric-400 mb-2">
                  Pro
                </h3>
                <div className="text-5xl font-black text-white mb-6 font-poppins">
                  ₹{isYearly ? "139" : "199"}
                  <span className="text-lg text-gray-400 font-normal">/mo</span>
                </div>
                <ul className="space-y-4 text-left font-semibold text-gray-300 mb-8 flex-1">
                  <li className="flex gap-3 items-start">
                    <span className="text-green-400">✅</span> Unlimited
                    messages
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-400">✅</span> Text + Voice mode
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-400">✅</span> Advanced
                    analytics
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-400">✅</span> Personalized
                    learning path
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-green-400">✅</span> Weekly progress
                    report
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="l-btn bg-white text-navy-800 w-full py-4 rounded-xl hover:bg-gray-100 mb-1"
                >
                  Pro Ban Jao! ⚡
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 8 - FAQ */}
      <section className="section-padding bg-[#FFF5EE]">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="landing-title text-3xl md:text-5xl text-navy-800 text-center mb-12">
              Sawaal? Jawab Ready Hai! 🙋
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <AnimatedSection key={idx} delay={idx * 100}>
                <div
                  className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <div className="flex justify-between items-center bg-white z-10 relative">
                    <h3 className="font-poppins font-bold text-lg text-navy-800 pr-4">
                      {faq.q}
                    </h3>
                    <div
                      className="w-8 h-8 rounded-full bg-saffron-50 flex items-center justify-center text-saffron-600 text-xl font-bold flex-shrink-0 transition-transform duration-300"
                      style={{
                        transform:
                          activeFaq === idx ? "rotate(45deg)" : "rotate(0)",
                      }}
                    >
                      +
                    </div>
                  </div>
                  <div
                    className={`faq-content ${activeFaq === idx ? "open mt-4" : ""}`}
                  >
                    <p className="text-gray-600 font-semibold leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 - FINAL CTA */}
      <section className="relative py-24 min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#FF6B35] to-[#1B4F72] text-center overflow-hidden">
        {/* Animated confetti background (simple CSS implementation) */}
        <div className="absolute inset-x-0 -top-20 bottom-0 pointer-events-none opacity-40">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${["bg-yellow-300", "bg-white", "bg-blue-300"][i % 3]}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animation: `floatEmojiUp ${5 + Math.random() * 5}s linear infinite ${Math.random() * 5}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        <AnimatedSection>
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative p-3">
            <img
              src={icon}
              alt="Vanni AI"
              className="w-full h-full object-cover animate-[popUp_2s_infinite_alternate]"
            />
            <div className="absolute -right-6 -top-6 bg-white py-2 px-4 rounded-2xl rounded-bl-none shadow-xl border-2 border-navy-100">
              <span className="font-bold text-navy-800 whitespace-nowrap">
                Chalo shuru karte hain! 🎉
              </span>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <h2 className="landing-title text-4xl md:text-6xl text-white mb-6 animate-[pulseSoft_3s_infinite] px-4">
            Ek Step Mein Badlo <br className="hidden md:block" />
            Apni Zindagi
          </h2>
          <p className="text-xl text-saffron-100 font-semibold mb-12 max-w-2xl mx-auto px-4">
            Join 50,000+ students already learning English with Vanni AI
          </p>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <Link
            to="/register"
            className="inline-block bg-white text-navy-800 font-poppins font-black text-2xl py-6 px-12 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all overflow-hidden relative group"
          >
            <span className="relative z-10">
              Abhi Shuru Karo — Bilkul Free! 🚀
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-100/50 to-transparent skew-x-12 w-1/2"></div>
          </Link>
          <p className="text-white/80 font-semibold mt-6 space-x-2">
            <span>No credit card required</span>
            <span className="text-white/40">•</span>
            <span>Cancel anytime</span>
            <span className="text-white/40">•</span>
            <span>Made with ❤️ for Bharat</span>
          </p>
        </AnimatedSection>

        <AnimatedSection
          delay={600}
          className="mt-16 w-full max-w-2xl flex flex-wrap justify-center gap-6 md:gap-12 px-4"
        >
          {["🔒 Secure Payment", "⭐ 4.8/5 Rating", "🇮🇳 Made in India"].map(
            (badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-white/90 font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
              >
                {badge}
              </div>
            ),
          )}
        </AnimatedSection>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0A131F] border-t border-navy-800 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 border-b border-navy-800 pb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white p-1">
                  <img src={icon} alt="Vanni AI" className="w-full h-full" />
                </div>
                <span className="font-poppins font-bold text-2xl text-white">
                  Vanni AI
                </span>
              </div>
              <p className="text-gray-400 font-semibold max-w-xs">
                Apni Awaaz, Apna English. The most natural way to learn English
                for Bharat.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-center md:text-left text-gray-300 font-semibold">
              <a href="#" className="hover:text-saffron-400 transition-colors">
                About Us
              </a>
              <a href="#" className="hover:text-saffron-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-saffron-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-saffron-400 transition-colors">
                Contact Support
              </a>
            </div>

            <div className="flex gap-4">
              {["Ig", "Tw", "Li"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-white hover:bg-saffron-500 transition-colors font-bold"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="text-center text-gray-500 font-semibold mt-8">
            © 2025 Vanni AI. Bharat ka apna English tutor. 🇮🇳
          </div>
        </div>
      </footer>
    </div>
  );
}
