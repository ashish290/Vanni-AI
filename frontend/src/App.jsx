import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PlanProvider } from "./context/PlanContext";
import { useAuth } from "./hooks/useAuth";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Chat from "./pages/Chat";
import VoiceMode from "./pages/VoiceMode";
import Upgrade from "./pages/Upgrade";
import Roadmap from "./pages/Roadmap";
import AuthCallback from "./pages/AuthCallback";
import { Toaster } from "react-hot-toast";
import icon from "./assets/icon.svg";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] dark:bg-gray-950">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-saffron-200 mx-auto mb-4 animate-pulse">
            <img
              src={icon}
              alt="Vanni AI"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-nunito">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] dark:bg-gray-950">
        <div className="w-8 h-8 border-3 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/chat" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute>
          <Landing />
        </PublicRoute>
      }
    />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <AuthPage initialView="login" />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <AuthPage initialView="register" />
        </PublicRoute>
      }
    />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route
      path="/chat"
      element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
    />
    <Route
      path="/voice"
      element={
        <ProtectedRoute>
          <VoiceMode />
        </ProtectedRoute>
      }
    />
    <Route
      path="/voice/:id"
      element={
        <ProtectedRoute>
          <VoiceMode />
        </ProtectedRoute>
      }
    />
    <Route
      path="/upgrade"
      element={
        <ProtectedRoute>
          <Upgrade />
        </ProtectedRoute>
      }
    />
    <Route
      path="/roadmap"
      element={
        <ProtectedRoute>
          <Roadmap />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <Router>
    <ThemeProvider>
      <AuthProvider>
        <PlanProvider>
          <Toaster position="top-center" />
          <AppRoutes />
        </PlanProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router>
);

export default App;
