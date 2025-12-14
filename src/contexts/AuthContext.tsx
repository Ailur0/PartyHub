import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "partyhub-authenticated";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    setIsAuthenticated(stored === "true");
    setLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      loading,
      login,
      logout,
    }),
    [isAuthenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
