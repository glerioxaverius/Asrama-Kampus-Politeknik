"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Notification from "@/components/notification";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { User } from "../types/user";

const Profile = () => {
  const { user: authUser, token, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (authUser) {
      console.log("Profile.useEffect: authUser:", authUser);
      setUser({ ...authUser });
      setEditedUser({ ...authUser });
      fetchUserProfile();
    } else {
      console.log("Profile.useEffect: authUser belum tersedia");
    }
  }, [token, router, authUser]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser({ ...user }); // Reset editedUser ke data asli
  };

  const handleSaveEdit = async () => {
    try {
      if (!editedUser) return;
      await api.put(`/users/${editedUser.id}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...editedUser });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) =>
      prevUser ? { ...prevUser, [name]: value } : null
    );
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handlePay = () => {
    // Logika pembayaran
    alert("Fitur Pembayaran");
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-4">
          <div className="rounded-full h-16 w-16 bg-gray-400 mr-4">
            {/* Letakkan gambar profil disini */}
          </div>
          <h1 className="text-2xl font-bold">
            Selamat Datang, {user?.username}
          </h1>
        </div>
        <p className="w-1/3 text-gray-700 mb-8">
          Platform terpadu untuk mengelola dan mengakses informasi penting serta
          berkolaborasi dengan tim Anda secara efektif.
        </p>
        <div className="w-1/2 ">
          <h2 className="text-xl font-bold mb-2">Informasi Pengguna</h2>
          <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {isEditing ? (
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="username"
                  name="username"
                  value={editedUser?.username || ""}
                  onChange={handleChange}
                />

                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser?.email || ""}
                  onChange={handleChange}
                />

                {/* Tambahkan input lain untuk field yang bisa diedit */}

                <div className="mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={handleSaveEdit}
                  >
                    Simpan
                  </button>
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold">{user?.username}</h3>
                <p>Email: {user?.email}</p>
                <p>Nomor Kamar: </p>
                <p>Penghuni Kamar:</p>
                {/* Tampilkan informasi pengguna lainnya */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={handleEditClick}
                >
                  Edit Informasi Pengguna
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bagian Penghuni Kamar (Jika Ada) */}
      </div>
    </div>
  );
};

export default Profile;
