// src/app/context/authContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api"; // Pastikan ini diimpor dengan benar
import { User } from "../types/user";

// Definisikan tipe untuk context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loadingInitialAuth: boolean;
  loginSuccess: (userData: User) => Promise<void>; // Fungsi baru setelah login berhasil
  logout: () => void;
  checkAuthStatus: () => Promise<void>; // Untuk memvalidasi ulang sesi
}

// Buat context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider komponen
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Status otentikasi
  const [loadingInitialAuth, setLoadingInitialAuth] = useState(true);
  const router = useRouter();

  // Fungsi untuk mengecek status otentikasi saat ini (menggunakan cookie)
  const checkAuthStatus = useCallback(async () => {
    console.log(
      "AuthContext: checkAuthStatus - Memulai pengecekan status otentikasi..."
    );
    try {
      // Panggilan ini akan secara otomatis mengirim cookie
      const response = await api.get("/users/me");
      setUser(response.data);
      setIsAuthenticated(true);
      console.log(
        "AuthContext: checkAuthStatus - Otentikasi berhasil. User:",
        response.data.username
      );
    } catch (error: any) {
      // Jika gagal (misal 401 Unauthorized), berarti cookie tidak valid/tidak ada
      console.error(
        "AuthContext: checkAuthStatus - Otentikasi gagal atau error:",
        error.response?.status,
        error.message
      );
      setUser(null);
      setIsAuthenticated(false);
      // Jangan langsung redirect di sini, biarkan komponen yang menggunakan context yang memutuskan
    } finally {
      setLoadingInitialAuth(false);
      console.log(
        "AuthContext: checkAuthStatus - Pengecekan awal selesai. loadingInitialAuth = false."
      );
    }
  }, []); // Tidak ada dependensi karena api adalah instance global

  // Efek untuk memuat status otentikasi awal saat aplikasi dimuat
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Fungsi yang dipanggil oleh halaman login setelah berhasil mendapatkan user dari backend
  const loginSuccess = useCallback(async (userData: User) => {
    console.log(
      "AuthContext.loginSuccess: User data diterima dari backend:",
      userData.username
    );
    setUser(userData);
    setIsAuthenticated(true);
    // Karena token di httpOnly cookie, kita tidak perlu menyimpannya di localStorage di sini.
    // Axios akan otomatis mengirim cookie di permintaan selanjutnya.
    console.log(
      "AuthContext.loginSuccess: State user diatur, isAuthenticated = true."
    );
  }, []);

  // Fungsi logout
  const logout = useCallback(async () => {
    console.log("AuthContext.logout: Memulai proses logout...");
    try {
      // Panggil endpoint logout di backend untuk menghapus cookie
      await api.post("/logout"); // Asumsikan ada endpoint logout di backend
      console.log("AuthContext.logout: Cookie dihapus di backend.");
    } catch (err) {
      console.error(
        "AuthContext.logout: Gagal menghapus cookie di backend:",
        err
      );
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log(
        "AuthContext.logout: State user dan isAuthenticated dihapus. Mengalihkan ke /login."
      );
      router.push("/login");
    }
  }, [router]);

  // Nilai yang akan disediakan oleh context
  const value = {
    user,
    isAuthenticated,
    loadingInitialAuth,
    loginSuccess,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
