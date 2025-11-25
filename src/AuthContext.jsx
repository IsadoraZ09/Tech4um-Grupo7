import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const login = useCallback((userData) => {
    setUser(userData);
    setLoginOpen(false);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  // Block body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isLoginOpen ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isLoginOpen]);

  return (
    <AuthContext.Provider
      value={{ user, isLoginOpen, openLogin, closeLogin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}

export default AuthContext;
