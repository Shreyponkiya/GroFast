import React from "react";
import { CheckCircle2 } from "lucide-react";

const DeletePopup = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null; // Hide when not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      {/* Popup box */}
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm border border-green-300 p-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-3">
          <CheckCircle2 className="text-green-500 w-12 h-12" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-green-700 mb-2">
          Confirm Action
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-sm mb-6">
          {message || "Are you sure you want to delete this item?"}
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-green-500 rounded-lg text-green-600 font-medium hover:bg-green-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
