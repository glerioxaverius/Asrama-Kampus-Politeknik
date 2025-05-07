import React from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
  onPay: () => void;
}

const notification: React.FC<NotificationProps> = ({
  message,
  onClose,
  onPay,
}) => {
  return (
    <div
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
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

export default notification;
