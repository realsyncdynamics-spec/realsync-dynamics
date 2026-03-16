import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  plan: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { displayName?: string; email?: string; bio?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Module-level token ref so getAuthToken() works outside of React components
let _currentToken: string | null = null;

export function getAuthToken(): string | null {
  return _currentToken;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setTokenAndRef = useCallback((t: string | null) => {
    _currentToken = t;
    setToken(t);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { username, password });
    const data = await res.json();
    setUser({
      id: data.user.id,
      username: data.user.username,
      email: data.user.email || "",
      displayName: data.user.displayName || data.user.username,
      plan: data.user.plan || "free",
    });
    setTokenAndRef(data.token);
  }, [setTokenAndRef]);

  const register = useCallback(async (username: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/register", { username, password });
    const data = await res.json();
    setUser({
      id: data.user.id,
      username: data.user.username,
      email: data.user.email || "",
      displayName: data.user.displayName || data.user.username,
      plan: data.user.plan || "free",
    });
    setTokenAndRef(data.token);
  }, [setTokenAndRef]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiRequest("POST", "/api/auth/logout", undefined);
      } catch {
        // Ignore logout errors — clear local state regardless
      }
    }
    setUser(null);
    setTokenAndRef(null);
  }, [token, setTokenAndRef]);

  const updateProfile = useCallback(async (data: { displayName?: string; email?: string; bio?: string }) => {
    const res = await apiRequest("PATCH", "/api/auth/profile", data);
    const updated = await res.json();
    setUser((prev) =>
      prev
        ? {
            ...prev,
            displayName: updated.displayName || prev.displayName,
            email: updated.email || prev.email,
          }
        : prev
    );
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiRequest("GET", "/api/auth/me");
      const data = await res.json();
      setUser({
        id: data.id,
        username: data.username,
        email: data.email || "",
        displayName: data.displayName || data.username,
        plan: data.plan || "free",
      });
    } catch {
      // If refresh fails, user may have been logged out server-side
      setUser(null);
      setTokenAndRef(null);
    }
  }, [token, setTokenAndRef]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, login, register, logout, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
