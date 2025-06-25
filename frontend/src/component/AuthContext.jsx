import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [healthInfo, setHealthInfo] =useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/auth-check", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
            setHealthInfo(data.healthInfo)
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setHealthInfo(null)
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
          setHealthInfo(null)
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
        setHealthInfo(null)
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = (userData,healthInfo) => {
    setUser(userData);
    setHealthInfo(healthInfo);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("LoingOut");
        setUser(null);
        setHealthInfo(null);
        setIsLoggedIn(false);
      } else {
        console.error("Logout failed:", response.status);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    user,
    healthInfo,
    setUser,
    setHealthInfo,
    isLoggedIn,
    isLoading, 
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
