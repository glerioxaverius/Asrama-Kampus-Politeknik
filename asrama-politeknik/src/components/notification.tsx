import React from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
  onPay: () => void;
  // --- ADD THIS LINE ---
  type: "success" | "error" | "info" | "warning" | string; // Use a union type for better safety
  // --- END ADDITION ---
}

const Notification: React.FC<NotificationProps> = ({
  message,
  onClose,
  onPay,
  type, // <-- Destructure the 'type' prop here
}) => {
  // You can now use the 'type' prop to conditionally apply styles or logic
  // For example, to change background/border colors based on the type
  let bgColorClass = "";
  let borderColorClass = "";
  let textColorClass = "";

  switch (type) {
    case "success":
      bgColorClass = "bg-green-100";
      borderColorClass = "border-green-500";
      textColorClass = "text-green-700";
      break;
    case "error":
      bgColorClass = "bg-red-100";
      borderColorClass = "border-red-500";
      textColorClass = "text-red-700";
      break;
    case "info":
      bgColorClass = "bg-blue-100";
      borderColorClass = "border-blue-500";
      textColorClass = "text-blue-700";
      break;
    case "warning": // Your existing yellow styling could be for 'warning'
    default: // Default to your yellow styling if type is not recognized or not provided
      bgColorClass = "bg-yellow-100";
      borderColorClass = "border-yellow-500";
      textColorClass = "text-yellow-700";
      break;
  }

  return (
    <div
      className={`${bgColorClass} ${borderColorClass} ${textColorClass} border-l-4 p-4`}
      role="alert"
    >
      <p className="font-bold">Pemberitahuan</p>
      <p>{message}</p>
      <div className="mt-4">
        <button
          onClick={onPay}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Bayar
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Notification;
