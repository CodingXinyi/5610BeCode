// components/LoginPrompt.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPrompt = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-sm mx-4 p-6 rounded-2xl shadow-xl text-center">
        <p className="text-lg font-medium mb-6">Please log in to explore more! ✨😎 </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition duration-150"
            onClick={() => {
              navigate("/home");
              onClose();
            }}
          >
            Login
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-xl transition duration-150"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
