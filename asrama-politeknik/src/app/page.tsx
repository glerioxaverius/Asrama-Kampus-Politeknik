"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import DormCard from "@/components/dormCard";
import { useAuth } from "./context/authContext";
import { useRouter } from "next/navigation";
import { api } from "./lib/api";
import { Dorm } from "./types/dorm";

const Home = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filteredDorms, setFilteredDorms] = useState(dorms);
  const [sortType, setSortType] = useState("");
  const { isAuthenticated, loadingInitialAuth } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loadingInitialAuth) {
      // Tambahkan pemeriksaan loading
      console.log(
        "Home.useEffect: Tidak terotentikasi atau masih loading, redirecting ke /login"
      );
      try {
        router.push("/login");
        console.log("Home.useEffect: router.push berhasil");
      } catch (error) {
        console.error("Home.useEffect: Error saat router.push:", error);
      }
    } else if (isAuthenticated) {
      console.log("Home.useEffect: Terotentikasi, memanggil fetchDorms");
      fetchDorms();
    }

    console.log("Home.useEffect: Selesai");

    return () => {
      console.log("Home.useEffect: Cleanup");
    };
  }, [isAuthenticated, loadingInitialAuth, router]);

  const fetchDorms = async () => {
    console.log("fetchDorms: Mulai");
    try {
      const response = await api.get("/dorms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDorms(response.data);
      console.log("fetchDorms: Berhasil", response.data);
      setFilteredDorms(response.data);
    } catch (error) {
      console.error("fetchDorms: Error:", error);
    }
    console.log("fetchDorms: Selesai");
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("handleFilterChange: Mulai", event.target.value);
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
    console.log("handleFilterChange: Selesai");
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("handleSortChange: Mulai", event.target.value);
    const selectedSortType = event.target.value;
    setSortType(selectedSortType);
    handleSort(selectedSortType, [...filteredDorms]);
    console.log("handleSortChange: Selesai");
  };

  const handleSort = (sortType: string, dormsToSort: any[]) => {
    console.log("handleSort: Mulai", sortType, dormsToSort);
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
    console.log("handleSort: Selesai", newSortedDorms);
  };
  if (!token) {
    console.log("Home: Tidak ada token, merender null");
    return null;
  }

  console.log("Home: Merender");
  return (
    <div className="bg-white w-full h-full">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-black text-3xl font-bold mb-4">Informasi Asrama</h1>
        <div className="w-1/3">
          <p className="text-gray-700 mb-8">
            Temukan informasi lengkap tentang asrama mahasiswa di kawasan
            Politeknik. Fasilitas modern dan lingkungan yang mendukung untuk
            kegiatan akademik.
          </p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-2xl text-black font-bold">Daftar Asrama</h2>
          <div>
            <label htmlFor="filter" className="mr-2 text-black">
              Filter:
            </label>
            <select
              id="filter"
              className="border-1 border-gray-200 text-black shadow-md rounded px-2 py-1 m-2"
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="">Semua</option>
              <option value="Putra">Putra</option>
              <option value="Putri">Putri</option>
            </select>

            <label htmlFor="sort" className="mr-2 text-black">
              Urutkan:
            </label>
            <select
              id="sort"
              className="border-1 border-gray-200 text-black shadow-md rounded px-2 py-1 m-2"
              value={sortType}
              onChange={handleSortChange}
            >
              <option value="">default</option>
              <option value="nama">Nama</option>
              <option value="kapasitas">Kapasitas</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDorms.map((dorm, index) => (
            <DormCard
              key={index}
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

        <div className="mt-8 flex justify-between"></div>
      </div>
    </div>
  );
};

export default Home;
