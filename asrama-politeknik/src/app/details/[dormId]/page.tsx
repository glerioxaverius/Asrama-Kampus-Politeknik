"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { api } from "@/app/lib/api";
import { Dorm } from "@/app/types/dorm";
import Navbar from "@/components/navbar";

const DormDetail = () => {
  const params = useParams();
  const router = useRouter();
  const dormId = params.dormId as string;

  const { isAuthenticated, loadingInitialAuth, logout } = useAuth(); // Ganti 'token' dengan 'isAuthenticated'
  const [dorm, setDorm] = useState<Dorm | null>(null);
  const [loadingDormData, setLoadingDormData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDormDetail = useCallback(
    async (idToFetch: string) => {
      setLoadingDormData(true);
      setError(null);
      try {
        // Panggilan ini akan secara otomatis mengirim cookie otentikasi
        const response = await api.get(`/dorms/${idToFetch}`);
        setDorm(response.data);
      } catch (err: any) {
        console.error("Error fetching dorm detail:", err);
        setError(err.response?.data?.message || "Gagal memuat detail asrama.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log(
            "Authentication failed during dorm detail fetch. Redirecting to login."
          );
          logout(); // Panggil logout untuk membersihkan state dan redirect
        }
      } finally {
        setLoadingDormData(false);
      }
    },
    [logout]
  ); // Dependensi hanya logout

  useEffect(() => {
    console.log(
      `DormDetail.useEffect: running. loadingInitialAuth: ${loadingInitialAuth}, isAuthenticated: ${isAuthenticated}, dormId: ${dormId}`
    );

    if (loadingInitialAuth) {
      console.log(
        "DormDetail.useEffect: Masih memuat status otentikasi awal..."
      );
      return;
    }

    if (!isAuthenticated) {
      console.log(
        "DormDetail.useEffect: Tidak terotentikasi, mengalihkan ke /login."
      );
      router.push("/login");
      return;
    }

    // Jika sudah terotentikasi dan ID tersedia, baru fetch data
    if (dormId) {
      console.log(
        `DormDetail.useEffect: Terotentikasi dan dormId tersedia. Memanggil fetchDormDetail untuk ID: ${dormId}`
      );
      fetchDormDetail(dormId);
    } else {
      console.warn("DormDetail.useEffect: dormId tidak ditemukan di URL.");
      setError("ID Asrama tidak ditemukan.");
      setLoadingDormData(false);
    }
  }, [dormId, isAuthenticated, loadingInitialAuth, router, fetchDormDetail]);

  useEffect(() => {
    if (loadingInitialAuth) {
      console.log(
        "DormDetail.useEffect: Masih memuat status otentikasi awal..."
      );
      return;
    }

    if (!isAuthenticated) {
      console.log(
        "DormDetail.useEffect: Tidak terotentikasi, mengalihkan ke /login."
      );
      router.push("/login");
      return;
    }

    if (dormId) {
      console.log(
        `DormDetail.useEffect: Terotentikasi dan dormId/token tersedia. Memanggil fetchDormDetail untuk ID: ${dormId}`
      );
      fetchDormDetail(dormId);
    } else if (!dormId) {
      console.warn("DormDetail.useEffect: dormId tidak ditemukan di URL.");
      setError("ID Asrama tidak ditemukan.");
      setLoadingDormData(false);
    } else {
      console.warn(
        "DormDetail.useEffect: Kondisi tidak terduga: token null setelah otentikasi."
      );
      setError("Token otentikasi tidak ditemukan.");
      setLoadingDormData(false);
    }
  }, [dormId, isAuthenticated, loadingInitialAuth, router, fetchDormDetail]);
  if (loadingInitialAuth || loadingDormData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-700">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Memuat detail asrama...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 p-4">
        <div className="text-center">
          <p className="font-semibold text-lg">Terjadi kesalahan!</p>
          <p>{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 shadow-md"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!dorm) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-600 p-4">
        <div className="text-center">
          <p className="font-semibold text-lg">Asrama tidak ditemukan.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Kembali ke Daftar Asrama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-12 px-4 md:px-0">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          {dorm.image && (
            <img
              src={dorm.image}
              alt={dorm.name}
              className="w-full h-80 object-cover rounded-t-lg"
            />
          )}
          <div className="p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {dorm.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-lg text-gray-700">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-semibold mr-1">Lokasi:</span>{" "}
                {dorm.location}
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0l3-3m-3 3l-3-3m3 3V10a6 6 0 016 6v4m-6 0h6"
                  />
                </svg>
                <span className="font-semibold mr-1">Kapasitas:</span>{" "}
                {dorm.capacity}
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 10a6 6 0 00-12 0v8a2 2 0 002 2h8a2 2 0 002-2v-8zm-6 4h.01"
                  />
                </svg>
                <span className="font-semibold mr-1">Gender:</span>{" "}
                {dorm.gender}
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b pb-2 border-gray-200">
              Fasilitas Unggulan
            </h2>
            {dorm.facilities && dorm.facilities.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-lg text-gray-700">
                {dorm.facilities.map((facility, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {facility}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                Tidak ada fasilitas yang tercantum.
              </p>
            )}

            <button
              onClick={() => router.back()}
              className="mt-10 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Kembali ke Daftar Asrama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DormDetail;
