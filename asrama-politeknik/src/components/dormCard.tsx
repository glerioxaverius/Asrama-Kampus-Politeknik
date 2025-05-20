"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { inherits } from "util";

interface DormCardProps {
  dormId: number;
  name: string;
  location: string;
  capacity: string;
  facilities: string[];
  imageLink: string;
  gender: string;
}
const dormCard: React.FC<DormCardProps> = ({
  dormId,
  name,
  location,
  capacity,
  facilities,
  imageLink,
  gender,
}) => {
  const router = useRouter();

  const handleDetailClick = () => {
    router.push(`/details/${dormId}`);
    console.log(`Navigating to /details/${dormId}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        {imageLink ? (
          <img
            src={imageLink}
            alt={name}
            className="w-full h-32 object-cover rounded-md mb-2"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
            Tidak ada gambar
          </div>
        )}
        <div className="text-black font-bold text-xl mb-2">{name}</div>
        <div className="text-black font-normal text-xl mb-2">{location}</div>
        <div className="flex justify-between">
          <p className="text-black text-base">Kapasitas: {capacity}</p>
          <div className="bg-gray-700 text-white rounded-xl w-auto px-3">
            {gender}
          </div>
        </div>
        <p className="text-black text-base">
          Fasilitas: {facilities.join(`, `)}
        </p>
      </div>
      <div className="px-6 py-4">
        <button
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          onClick={handleDetailClick}
        >
          Detail
        </button>
      </div>
    </div>
  );
};

export default dormCard;
