import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // console.log(`${process.env.REACT_APP_API_URL}/login`); 
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthenticated(true);
          const data = await res.json();
          setUser(data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      setIsAuthenticated(true);
      setUser(userData);
      // return back for the success value 
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return false; 
    }
  };

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  };

  const register = async (email, password, userName) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userName }),
    });

    if (res.ok) {
      const userData = await res.json();
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthUser = () => useContext(AuthContext);
