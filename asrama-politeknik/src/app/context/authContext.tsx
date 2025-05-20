"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { User } from "@/app/types/user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (newToken: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loadingInitialAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("AuthProvider Dirender");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingInitialAuth, setLoadingInitialAuth] = useState(true);

  useEffect(() => {
    const checkAuthOnLoad = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          // Tambahkan logika opsional untuk memvalidasi token ke backend di sini
        } catch (error) {
          console.error("Error parsing auth data from localStorage:", error);
          // Hapus data yang rusak dari localStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoadingInitialAuth(false); // Selesai memeriksa otentikasi awal
    };

    checkAuthOnLoad();
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loadingInitialAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {loadingInitialAuth ? <div>Loading...</div> : children}{" "}
      {/* Tampilkan loading jika otentikasi awal belum selesai */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
