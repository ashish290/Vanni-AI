# Vaani AI 🎙️
### *Apni Awaaz, Apna English*

**Vaani AI** is an AI-powered English learning app built specifically for Hindi speakers in India. Unlike generic language apps, Vaani AI provides a personalized tutor experience — meet **Vanni**, your warm, funny, and highly intelligent English tutor who remembers your mistakes, teaches in Hindi when needed, and makes every conversation feel like talking to a real friend.

---

## ✨ Features

### 🤖 Vanni — Your AI English Tutor
- Conversational English practice with a warm, human-like tutor
- Explains grammar rules in **simple Hindi** so students truly understand *why*
- Corrects mistakes naturally mid-conversation — never robotic or harsh
- Remembers past mistakes across sessions and refers back to them
- Adapts teaching style to Beginner, Intermediate, and Advanced levels

### 🗣️ Voice Mode
- Full **voice-to-voice** conversation with Vanni
- Powered by **Sarvam Saaras v3** (Speech-to-Text) — supports Hindi, English, and Hinglish
- Vanni speaks back using **Sarvam Bulbul v3** (Text-to-Speech) in a natural Indian English voice
- Real-time WebSocket streaming for low-latency conversation
- All voice conversations saved to chat history automatically

### 🎯 Smart Quiz System
- Auto-generated quizzes after every 5 messages based on actual conversation content
- 5 quiz types: Grammar Fix, Fill in the Blank, Word Meaning, Sentence Building, Tense Identification
- Quizzes appear **inline in chat** — feels like part of the conversation
- Earn XP for correct answers, build streaks, unlock badges

### 🗺️ Structured Learning Roadmap
- Personalized roadmap for Beginner, Intermediate, and Advanced levels
- 6 stages per roadmap — each with specific topics, practice goals, and unlock quizzes
- Visual game-map style progress (locked → current → completed)
- Vanni guides every conversation toward the user's current stage goals

### 📊 XP & Levels System
- Earn XP through conversations and quizzes
- 6 levels: Beginner 🌱 → Elementary 📚 → Intermediate ⭐ → Advanced 🔥 → Expert 💎 → Master 👑
- Streak tracking, badges, and leaderboard
- Progress dashboard with accuracy stats and quiz history

### 🎨 Rich Chat UI
- **Orange highlights** on correct/important words using `<hl>` tags
- **Red strikethrough** on wrong words using `<wrong>` tags
- Inline quiz bubbles — no popups or overlays
- Typing indicators, streaming responses, smooth animations
- Dark mode UI with clean minimal design

### 💳 Subscription Plans
| Plan | Price | Messages | Voice | History |
|------|-------|----------|-------|---------|
| Free | ₹0/month | 20/day | ❌ | 7 days |
| Basic | ₹149/month | 100/day | ✅ | 30 days |
| Pro | ₹299/month | Unlimited | ✅ | Forever |

- Payments via **Razorpay** (UPI, Cards, NetBanking, Wallets)
- Secure signature verification on every payment
- Auto plan expiry and renewal reminders

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite) + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **LLM** | Sarvam AI — Sarvam-M |
| **STT** | Sarvam AI — Saaras v3 |
| **TTS** | Sarvam AI — Bulbul v3 |
| **Database** | PostgreSQL (Aiven) |
| **Auth** | JWT + Google OAuth 2.0 |
| **Realtime** | WebSocket (voice) + SSE (text streaming) |
| **Payments** | Razorpay |
| **Animations** | Lottie React |
| **Hosting** | Vercel (frontend) + Railway (backend) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│  Chat UI  │  Voice Mode  │  Roadmap  │  Progress     │
└─────────────────────┬───────────────────────────────┘
                      │ REST API + WebSocket
┌─────────────────────▼───────────────────────────────┐
│                 BACKEND (Node.js)                    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           VIDYA ENGINE (Multi-Agent)         │    │
│  │                                              │    │
│  │  Orchestrator → Analyzer → Tutor → Memory   │    │
│  │                    ↓           ↓             │    │
│  │              Quiz Agent   Roadmap Service    │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  Routes: /auth  /chat  /voice  /quiz  /roadmap       │
│          /payment  /user  /plan                      │
└──────────┬──────────────────────────────────────────┘
           │
     ┌─────┼──────────┐
     ▼     ▼          ▼
 Sarvam  Aiven    Razorpay
  AI     PostgreSQL
```

### Vidya Engine — Multi-Agent System

| Agent | Role |
|-------|------|
| **Orchestrator** | Coordinates all agents sequentially |
| **Tutor (Vanni)** | Generates warm, educational responses |
| **Analyzer** | Silently detects grammar mistakes, returns JSON |
| **Memory** | Reads/writes to PostgreSQL |
| **Quiz Agent** | Generates contextual quiz questions |

---

## 📁 Project Structure

```
vaani-ai/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── MessageBubble.jsx      # Chat bubbles with highlights
│       │   ├── QuizBubble.jsx         # Inline quiz in chat
│       │   ├── QuizResultBubble.jsx   # Quiz result message
│       │   ├── XPBar.jsx              # XP progress in header
│       │   ├── StreakBadge.jsx        # Streak counter
│       │   ├── BadgePopup.jsx         # New badge celebration
│       │   ├── PriyaAvatar.jsx        # Lottie avatar for voice
│       │   ├── UsageBar.jsx           # Daily message usage
│       │   ├── VoiceModeToggle.jsx    # Text/Voice toggle
│       │   └── PlanCard.jsx           # Subscription plan card
│       ├── pages/
│       │   ├── Chat.jsx               # Main chat interface
│       │   ├── VoiceMode.jsx          # Voice conversation UI
│       │   ├── Roadmap.jsx            # Learning roadmap page
│       │   ├── Progress.jsx           # Stats and badges
│       │   ├── Upgrade.jsx            # Subscription page
│       │   ├── Login.jsx              # Auth page
│       │   ├── Register.jsx           # Registration page
│       │   └── AuthCallback.jsx       # Google OAuth callback
│       ├── hooks/
│       │   ├── useChat.js             # Chat state and logic
│       │   ├── useStream.js           # SSE streaming
│       │   ├── useAuth.js             # Auth state
│       │   ├── useRealtimeVoice.js    # WebSocket voice
│       │   ├── useQuiz.js             # Quiz state
│       │   └── usePlanStatus.js       # Plan and limits
│       ├── services/
│       │   ├── api.js                 # All API calls
│       │   ├── speechService.js       # Audio playback
│       │   └── paymentService.js      # Razorpay integration
│       ├── context/
│       │   └── AuthContext.jsx        # Global auth state
│       └── animations/
│           ├── idle.json              # Vanni idle animation
│           ├── listening.json         # Vanni listening
│           └── talking.json           # Vanni speaking
│
└── backend/
    ├── agents/
    │   ├── orchestratorAgent.js       # Main coordinator
    │   ├── tutorAgent.js              # Vanni responses
    │   ├── analyzerAgent.js           # Mistake detection
    │   ├── memoryAgent.js             # DB read/write
    │   └── quizAgent.js               # Quiz generation
    ├── routes/
    │   ├── auth.js                    # Login, register, Google OAuth
    │   ├── chat.js                    # Chat endpoints
    │   ├── voice.js                   # Voice REST endpoints
    │   ├── quiz.js                    # Quiz endpoints
    │   ├── roadmap.js                 # Roadmap endpoints
    │   ├── payment.js                 # Razorpay endpoints
    │   ├── user.js                    # User profile
    │   └── plan.js                    # Plan management
    ├── services/
    │   ├── sarvamService.js           # All Sarvam AI calls
    │   ├── dbService.js               # PostgreSQL functions
    │   ├── razorpayService.js         # Payment processing
    │   ├── quizService.js             # Quiz logic and XP
    │   └── roadmapService.js          # Roadmap progression
    ├── prompts/
    │   ├── tutorPrompt.js             # Vanni system prompt
    │   ├── analyzerPrompt.js          # Analyzer prompt
    │   └── orchestratorPrompt.js      # Orchestrator prompt
    ├── middleware/
    │   ├── authMiddleware.js          # JWT verification
    │   ├── usageLimiter.js            # Daily message limits
    │   ├── rateLimiter.js             # API rate limiting
    │   └── errorHandler.js            # Global error handler
    ├── data/
    │   └── roadmapData.js             # Complete roadmap content
    ├── voiceWebSocket.js              # WebSocket voice server
    └── server.js                      # Express + HTTP server
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (Aiven free tier recommended)
- Sarvam AI account — [dashboard.sarvam.ai](https://dashboard.sarvam.ai)
- Razorpay account — [razorpay.com](https://razorpay.com)
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vaani-ai.git
cd vaani-ai
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

**Backend — `backend/.env`**
```env
# Server
PORT=8000
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your_jwt_secret_minimum_32_characters

# Database
DATABASE_URL=postgres://user:pass@host:port/db?sslmode=require

# Sarvam AI
SARVAM_API_KEY=your_sarvam_api_key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
```

**Frontend — `frontend/.env`**
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
VITE_APP_NAME=Vaani AI
```

### 4. Setup Database

Run the SQL schema in your Aiven PostgreSQL instance:

```bash
psql $DATABASE_URL -f backend/database/schema.sql
```

### 5. Start Development Servers

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:8000`

---

## 🔑 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to Vanni |
| GET | `/api/chat/history/:conversationId` | Get chat history |
| GET | `/api/chat/conversations` | Get all conversations |

### Voice
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/voice/stt` | Speech to text |
| POST | `/api/voice/tts` | Text to speech |
| WS | `/ws/voice` | Real-time voice conversation |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/generate` | Generate quiz from conversation |
| POST | `/api/quiz/answer` | Submit quiz answer |
| GET | `/api/quiz/stats` | Get user quiz statistics |

### Roadmap
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roadmap` | Get full roadmap with progress |
| GET | `/api/roadmap/current` | Get current stage details |
| POST | `/api/roadmap/advance` | Check stage advancement |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |
| GET | `/api/payment/history` | Get payment history |

---

## 🌐 Deployment

### Frontend — Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
# Add environment variables in Vercel dashboard
```

### Backend — Railway
```bash
# Connect GitHub repo to Railway
# Add all backend environment variables
# Update GOOGLE_CALLBACK_URL to production URL
# Update FRONTEND_URL to production URL
```

### Production Environment Updates
```env
# Backend
FRONTEND_URL=https://vaaniai.com
GOOGLE_CALLBACK_URL=https://api.vaaniai.com/api/auth/google/callback

# Razorpay — switch to live keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret
```

> **Important:** Add your production callback URL to Google Cloud Console under Authorized Redirect URIs before going live.

---

## 🧪 Testing

### Test Payment Flow (Razorpay Test Mode)
```
Test Card:  4111 1111 1111 1111
Expiry:     Any future date
CVV:        Any 3 digits
OTP:        1234

Test UPI Success:  success@razorpay
Test UPI Failure:  failure@razorpay
```

### Test Voice Mode
Voice mode requires Chrome or Edge browser.
Microphone permission must be granted.
Firefox is not supported for voice.

---

## 💰 Sarvam AI Pricing

| Service | Cost | Free Credits Cover |
|---------|------|--------------------|
| Sarvam-M (LLM) | **FREE** | Unlimited |
| Bulbul v3 (TTS) | ₹15 per 10K chars | ~3.3 crore characters |
| Saaras v3 (STT) | ₹30 per hour | ~33 hours of audio |

> ₹1,000 free credits on signup — never expire. Covers full MVP development and beta testing.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📋 Roadmap

- [x] Text chat with Vanni
- [x] Voice-to-voice conversation
- [x] Grammar correction with Hindi explanation
- [x] Inline quiz system with XP
- [x] Structured learning roadmap
- [x] Razorpay payment integration
- [x] Google OAuth
- [ ] React Native mobile app
- [ ] Razorpay Subscriptions (auto-renewal)
- [ ] Push notifications and streak reminders
- [ ] Roleplay scenarios (job interview, shopping, travel)
- [ ] Multiple Indian language support (Tamil, Telugu, Bengali)
- [ ] Gamification — leaderboard and challenges
- [ ] Mentor mode for advanced users

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Sarvam AI](https://sarvam.ai) — for incredible Indian language AI models
- [Razorpay](https://razorpay.com) — for seamless Indian payments
- [Aiven](https://aiven.io) — for free PostgreSQL hosting
- [Lottie Files](https://lottiefiles.com) — for beautiful animations
- Every Hindi speaker who wants to speak English confidently ❤️

---

<div align="center">

**Built with ❤️ for India**

*Vaani AI — Apni Awaaz, Apna English*

</div>
