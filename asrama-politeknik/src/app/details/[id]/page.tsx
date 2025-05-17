"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/app/lib/api"; // Asumsi Anda punya instance axios di sini
import { DetailData } from "@/app/types/detail";

interface Params {
  id: string;
  [key: string]: string;
}

const DetailPage = () => {
  const { id } = useParams<Params>();
  const [detailData, setDetailData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/details/${id}`); // Sesuaikan endpoint API Anda
        setDetailData(response.data);
      } catch (error: any) {
        console.error("Error fetching detail:", error);
        setError(error.message || "Failed to fetch detail");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return <div>Loading detail...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!detailData) {
    return <div>Detail not found.</div>;
  }

  return (
    <div>
      <h1>Detail Page for ID: {id}</h1>
      {/* Tampilkan detailData di sini */}
      {detailData.name && <p>Name: {detailData.name}</p>}
      {detailData.description && <p>Description: {detailData.description}</p>}
      {/* ... tampilkan properti lain dari detailData */}
    </div>
  );
};

export default DetailPage;
