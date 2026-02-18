"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, getNickname, getRole, logout as authLogout } from "@/lib/auth";

interface AuthContextType {
  nickname: string | null;
  role: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  refresh: () => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  nickname: null,
  role: null,
  isLoggedIn: false,
  isAdmin: false,
  refresh: () => {},
  handleLogout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nickname, setNickname] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refresh = () => {
    const token = getToken();
    const name = getNickname();
    const userRole = getRole();
    setIsLoggedIn(!!token);
    setNickname(name);
    setRole(userRole);
  };

  const handleLogout = () => {
    authLogout();
    setNickname(null);
    setRole(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const isAdmin = role === "ADMIN";

  return (
    <AuthContext.Provider value={{ nickname, role, isLoggedIn, isAdmin, refresh, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
