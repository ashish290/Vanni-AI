import { createContext, useState, useEffect, useCallback } from "react";
import * as api from "../services/api";
import { setToken, getToken, removeToken } from "../services/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          removeToken();
        }
      } catch (error) {
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  }, []);

  const register = useCallback(async (name, email, password, level) => {
    const data = await api.register(name, email, password, level);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    const data = await api.verifyOTP(email, otp);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  }, []);

  const resendOTP = useCallback(async (email) => {
    return await api.resendOTP(email);
  }, []);

  const loginWithToken = useCallback(async (token) => {
    setToken(token);
    setIsLoading(true);
    try {
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        removeToken();
        setIsAuthenticated(false);
      }
      return data;
    } catch (error) {
      removeToken();
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    verifyOTP,
    resendOTP,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
