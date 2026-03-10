import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import icon from "../assets/icon.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(email, password);
      if (data.success) {
        toast.success("Welcome back!");
        navigate("/chat");
      } else {
        const msg = data.error || "Login failed. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF8] via-white to-saffron-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-saffron-400/20 dark:bg-saffron-500/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-turmeric-400/20 dark:bg-turmeric-500/20 blur-3xl animate-float-reverse" />

      <div className="w-full max-w-md animate-bounce-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-saffron-200">
              <img
                src={icon}
                alt="Vanni AI"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-poppins font-bold text-3xl text-navy-700 dark:text-white">
              Vanni AI
            </span>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 font-nunito mt-3">
            Welcome back! Let's continue learning 📚
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card dark:bg-gray-800/80 dark:border-gray-700 rounded-3xl p-8 shadow-xl">
          <h2 className="font-poppins font-bold text-2xl text-navy-700 dark:text-white mb-6 text-center">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 font-nunito focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 font-nunito focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 tracking-widest"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-saffron-500 to-turmeric-500 shadow-lg shadow-saffron-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-saffron-600 font-semibold hover:text-saffron-700 transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
