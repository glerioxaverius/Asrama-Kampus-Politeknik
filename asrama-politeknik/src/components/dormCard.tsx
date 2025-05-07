import React from "react";
import Link from "next/link";

interface DormCardProps {
  name: string;
  capacity: string;
  facilities: string[];
  link: string;
}

const dormCard: React.FC<DormCardProps> = ({
  name,
  capacity,
  facilities,
  link,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{name}</div>
        <p className="text-gray-700 text-base">Kapasitas: {capacity}</p>
        <p className="text-gray-700 text-base">
          Fasilitas: {facilities.join(`, `)}
        </p>
      </div>
      <div className="px-6 py-4">
        <Link
          href={link}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        ></Link>
      </div>
    </div>
  );
};

export default dormCard;
