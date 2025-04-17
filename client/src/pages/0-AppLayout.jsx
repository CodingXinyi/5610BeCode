"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { LogIn, LogOut, Code } from "lucide-react";
import { useAuthUser } from "../services/security/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import xinyiIcon from '../components/images/XinyiIcon.JPG';


export default function AppLayout() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, logout, login } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !login) {
      // Token expired, show the modal
      setShowModal(true);
    }
  }, [isAuthenticated && !login]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/home");
  };

  const handleLoginRedirect = () => {
    navigate("/home");
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };


  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/home" className="flex items-center gap-2 hover:cursor-pointer">
              <Code className="h-6 w-6 text-black" />
              {/* <h2 className="text-xl font-medium">BeCoding 🐱🐭</h2> */}
              <h2 className="text-xl font-medium">🐝 BeCoding</h2>
              {/* <img src="https://www.citypng.com/public/uploads/preview/cute-hello-kitty-face-sanrio-kitty-hd-transparent-png-735811696610249jwuhmkcufs.png" alt="Hello Kitty" className="h-6 w-6" /> */}
              {/* <img src={xinyiIcon} alt="Hello Kitty" className="h-6 w-6" />               */}
            </Link>
          </div>
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button onClick={handleLoginRedirect} className="material-btn-primary px-4 py-2">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-medium mb-4">Your session has expired</h2>
            <p className="mb-4">Please log in again to continue using the application.</p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleLoginRedirect}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Login Again
              </Button>
              <Button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="content">
        <Outlet />
      </div>
    </>
  );
}
