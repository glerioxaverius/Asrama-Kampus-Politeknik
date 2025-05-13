import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authContext";
import { api } from "../lib/api";
import { Dorm } from "../types/dorm";
import Navbar from "@/components/navbar";

const DormDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [dorm, setDorm] = useState<Dorm | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (id) {
      fetchDormDetail(id as string);
    }
  }, [token, id, router]);

  const fetchDormDetail = async (dormId: string) => {
    try {
      const response = await api.get(`/dorms/${dormId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDorm(response.data);
    } catch (error) {
      console.error("Error fetching dorm detail:", error);
      // Handle error
    }
  };

  if (!token || !dorm) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">{dorm.name}</h1>
        {/* Tampilkan detail asrama */}
        <p>Location: {dorm.location}</p>
        <p>Capacity: {dorm.capacity}</p>
        {/* ... dll */}
      </div>
    </div>
  );
};

export default DormDetail;
