"use client";

import React, { useState, useEffect, useCallback, useRef } from "react"; // Tambahkan useRef
import Notification from "@/components/notification";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { User } from "../types/user";
import Navbar from "@/components/navbar";

const Profile = () => {
  const {
    user: authUser, // User dari AuthContext
    isAuthenticated,
    loadingInitialAuth,
    logout,
  } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null); // State lokal untuk data profil yang ditampilkan
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null); // State untuk data yang sedang diedit
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(true);

  const hasFetchedProfile = useRef(false); // Gunakan useRef untuk melacak apakah profil sudah diambil

  // Fungsi untuk mengambil data profil pengguna dari backend
  const fetchUserProfile = useCallback(async () => {
    console.log(
      ">>> fetchUserProfile called. Checking authentication status..."
    );
    try {
      const response = await api.get(`/users/me`);
      setUser(response.data); // Set state user lokal
      setEditedUser(response.data); // Inisialisasi editedUser langsung dari data yang diambil
      console.log(">>> User profile fetched successfully:", response.data);
      setError("");
      hasFetchedProfile.current = true; // Tandai bahwa profil sudah diambil
    } catch (err: any) {
      console.error(">>> Error fetching user profile:", err);
      setError(err.response?.data?.message || "Gagal memuat profil.");
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log(
          ">>> Authentication failed during profile fetch. Redirecting to login."
        );
        logout();
      }
      setUser(null);
      setEditedUser(null);
      hasFetchedProfile.current = false;
    }
  }, [logout]);

  useEffect(() => {
    console.log("--- Profile.useEffect triggered ---");
    console.log("Current isAuthenticated in useEffect:", isAuthenticated);
    console.log("Current authUser in useEffect:", authUser);
    console.log("Current loadingInitialAuth in useEffect:", loadingInitialAuth);

    if (loadingInitialAuth) {
      console.log(
        "--- Profile: Masih memuat status otentikasi awal, tunggu..."
      );
      return;
    }

    if (!isAuthenticated) {
      console.log("--- Profile: Tidak terotentikasi, mengalihkan ke /login.");
      router.push("/login");
      return;
    }

    if (isAuthenticated && !hasFetchedProfile.current) {
      console.log(
        "--- Profile: Terotentikasi dan profil belum diambil. Memanggil fetchUserProfile."
      );
      fetchUserProfile();
    }
  }, [isAuthenticated, loadingInitialAuth, router, fetchUserProfile]);

  // Fungsi untuk masuk mode edit
  const handleEditClick = () => {
    if (user) {
      setEditedUser({ ...user }); // Salin data user saat ini ke editedUser
      setIsEditing(true);
      setError("");
      console.log(
        "handleEditClick: Memasuki mode edit. editedUser diinisialisasi ke:",
        { ...user }
      );
    } else {
      console.warn(
        "handleEditClick: Data pengguna (state 'user') adalah null, tidak dapat masuk mode edit."
      );
      setError(
        "Tidak dapat mengedit: Data profil belum dimuat sepenuhnya. Coba refresh halaman."
      );
      setIsEditing(false);
    }
  };

  // Fungsi untuk membatalkan edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Pastikan editedUser kembali ke data 'user' yang asli
    if (user) {
      setEditedUser({ ...user });
      console.log(
        "handleCancelEdit: Keluar mode edit. editedUser kembali ke:",
        user
      );
    } else {
      setEditedUser(null);
      console.log("handleCancelEdit: Keluar mode edit. User data null.");
    }
    setError("");
  };

  const handleSaveEdit = async () => {
    console.log("handleSaveEdit: Mencoba menyimpan editedUser:", editedUser);
    try {
      if (!editedUser || !editedUser.id) {
        setError("Data pengguna tidak valid untuk disimpan.");
        console.error("handleSaveEdit: editedUser atau ID-nya null.");
        return;
      }
      const response = await api.put(`/users/${editedUser.id}`, editedUser);
      setUser({ ...editedUser });
      setIsEditing(false);
      setError("");
      console.log(
        "handleSaveEdit: Profil berhasil diperbarui. Respon:",
        response.data
      );
    } catch (err: any) {
      console.error(
        "handleSaveEdit: Error saat memperbarui profil:",
        err.response?.status,
        err.message,
        err.response?.data
      );
      setError(err.response?.data?.message || "Gagal memperbarui profil.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`handleChange: Input ${name} berubah menjadi: "${value}"`);
    setEditedUser((prevUser) => {
      if (prevUser) {
        const updatedUser = { ...prevUser, [name]: value };
        console.log(
          "handleChange: editedUser yang akan diperbarui:",
          updatedUser
        );
        return updatedUser;
      }
      console.warn(
        "handleChange: prevUser adalah null, tidak bisa memperbarui editedUser."
      );
      return null;
    });
  };

  function handleCloseNotification(): void {
    setShowNotification(false);
  }

  console.log(
    "Profile Component Render: current editedUser state:",
    editedUser
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <p className="text-gray-700 mb-8 leading-relaxed">
            Platform terpadu untuk mengelola dan mengakses informasi penting
            serta berkolaborasi dengan tim Anda secara efektif. Informasi di
            bawah ini dapat Anda perbarui.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Informasi Akun
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="text"
                    id="username"
                    name="username"
                    value={editedUser?.username || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="email"
                    id="email"
                    name="email"
                    value={editedUser?.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleSaveEdit}
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-gray-800">
                <p className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-semibold text-gray-600">Username:</span>
                  <span>{user?.username || "N/A"}</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-semibold text-gray-600">Email:</span>
                  <span>{user?.email || "N/A"}</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-semibold text-gray-600">
                    Nomor Kamar:
                  </span>
                  <span>N/A</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-semibold text-gray-600">
                    Penghuni Kamar:
                  </span>
                  <span>N/A</span>
                </p>
                <div className="mt-6 text-right">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleEditClick}
                  >
                    Edit Informasi Pengguna
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
