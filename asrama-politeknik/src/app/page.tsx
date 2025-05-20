"use client";
import act, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import DormCard from "@/components/dormCard";
import { useAuth } from "./context/authContext";
import { useRouter } from "next/navigation";
import { api } from "./lib/api";
import { Dorm } from "./types/dorm";

const Home = () => {
  const { isAuthenticated, loadingInitialAuth, logout } = useAuth();
  const router = useRouter();

  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filteredDorms, setFilteredDorms] = useState<Dorm[]>([]);
  const [sortType, setSortType] = useState("");
  const [loadingDorms, setLoadingDorms] = useState(true);
  const [errorDorms, setErrorDorms] = useState<string | null>(null);

  useEffect(() => {
    if (loadingInitialAuth) {
      return;
    }
    if (!isAuthenticated) {
      console.log("Home.useEffect: Tidak terotentikasi, mengalihkan ke /login");
      router.push("/login");
      return;
    }

    console.log("Home.useEffect: Terotentikasi, memanggil fetchDorms");
    fetchDorms();
  }, [isAuthenticated, loadingInitialAuth, router]);

  const fetchDorms = async () => {
    console.log("fetchDorms: Mulai");
    setLoadingDorms(true);
    setErrorDorms(null);
    try {
      const response = await api.get("/dorms");

      setDorms(response.data);
      setFilteredDorms(response.data);
      console.log("fetchDorms: Berhasil", response.data);
    } catch (err: any) {
      console.error("fetchDorms: Error:", err);
      setErrorDorms(
        err.response?.data?.message || "Gagal memuat daftar asrama."
      );
      setDorms([]);
      setFilteredDorms([]);
    } finally {
      setLoadingDorms(false);
      console.log("fetchDorms: Selesai");
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setFilterType(selectedType);

    let newFilteredDorms = [...dorms];

    if (selectedType !== "") {
      newFilteredDorms = newFilteredDorms.filter(
        (dorm) => dorm.gender === selectedType
      );
    }
    setFilteredDorms(newFilteredDorms);
    handleSort(sortType, newFilteredDorms);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortType = event.target.value;
    setSortType(selectedSortType);
    handleSort(selectedSortType, [...filteredDorms]);
  };

  const handleSort = (sortType: string, dormsToSort: Dorm[]) => {
    let newSortedDorms = [...dormsToSort];

    if (sortType === "nama") {
      newSortedDorms.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "kapasitas") {
      newSortedDorms.sort((a, b) => {
        const capacityA = parseInt(a.capacity.split("/")[0]);
        const capacityB = parseInt(b.capacity.split("/")[0]);
        return capacityA - capacityB;
      });
    }
    setFilteredDorms(newSortedDorms);
  };

  if (loadingInitialAuth || loadingDorms) {
    console.log("Home: Merender Loading...");
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
          <span>Memuat daftar asrama...</span>
        </div>
      </div>
    );
  }

  if (errorDorms) {
    console.log("Home: Merender Error:", errorDorms);
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-700 p-4">
        <div className="text-center">
          <p className="font-semibold text-lg">Terjadi kesalahan!</p>
          <p>{errorDorms}</p>
          <button
            onClick={fetchDorms}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }
  console.log("Home: Merender daftar asrama.");
  return (
    <div className="bg-gray-50 min-h-screen">
      {" "}
      {/* Set a subtle background color */}
      <Navbar />
      <div className="container mx-auto py-12 px-4 md:px-0">
        {" "}
        {/* Add more vertical padding */}
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-gray-900 text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Temukan Asrama Ideal Anda
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl">
            Jelajahi daftar asrama mahasiswa dengan fasilitas modern dan
            lingkungan yang mendukung untuk kegiatan akademik Anda.
          </p>
        </div>
        {/* Filter and Sort Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <h2 className="text-2xl text-gray-800 font-bold flex-shrink-0">
            Daftar Asrama
          </h2>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <div className="flex items-center w-full md:w-auto">
              <label
                htmlFor="filter"
                className="mr-3 text-gray-700 font-medium whitespace-nowrap"
              >
                Filter Tipe:
              </label>
              <select
                id="filter"
                className="flex-grow border border-gray-300 text-gray-800 rounded-md px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={filterType}
                onChange={handleFilterChange}
              >
                <option value="">Semua</option>
                <option value="Putra">Putra</option>
                <option value="Putri">Putri</option>
              </select>
            </div>

            <div className="flex items-center w-full md:w-auto">
              <label
                htmlFor="sort"
                className="mr-3 text-gray-700 font-medium whitespace-nowrap"
              >
                Urutkan Berdasarkan:
              </label>
              <select
                id="sort"
                className="flex-grow border border-gray-300 text-gray-800 rounded-md px-4 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={sortType}
                onChange={handleSortChange}
              >
                <option value="">Default</option>
                <option value="nama">Nama</option>
                <option value="kapasitas">Kapasitas</option>
              </select>
            </div>
          </div>
        </div>
        {/* Dorm Cards Grid */}
        {filteredDorms.length === 0 ? (
          <div className="text-gray-600 text-center text-xl p-8 bg-white rounded-lg shadow-md">
            Tidak ada asrama ditemukan yang sesuai dengan kriteria Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDorms.map((dorm, index) => (
              <DormCard
                key={dorm.id || index}
                dormId={dorm.id}
                imageLink={dorm.image}
                name={dorm.name}
                location={dorm.location}
                capacity={dorm.capacity}
                facilities={dorm.facilities}
                gender={dorm.gender}
              />
            ))}
          </div>
        )}
        <div className="mt-12 text-center text-gray-500">
          <p>&copy; 2025 Asrama Politeknik. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
