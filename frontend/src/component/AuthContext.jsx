import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [healthInfo, setHealthInfo] =useState(null);
  const [totalDonations,setTotalDonations] =useState(0);
  const [totalRequests,setTotalRequests] =useState(0);

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
            if(data.user.ban){
              setUser(null);
            setHealthInfo(null)
            setTotalDonations(0);
            setTotalRequests(0);
            setIsLoggedIn(false);

            }else{
              setUser(data.user);
            setHealthInfo(data.healthInfo);
            setTotalDonations(data.totalDonations);
            setTotalRequests(data.totalRequests);
            setIsLoggedIn(true);

            }
            
          } else {
            setUser(null);
            setHealthInfo(null)
            setTotalDonations(0);
            setTotalRequests(0);
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
          setHealthInfo(null)
          setTotalDonations(0);
          setTotalRequests(0);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
        setHealthInfo(null)
        setTotalDonations(0);
        setTotalRequests(0);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = (userData,healthInfo,totalDonations,totalRequests) => {
    setUser(userData);
    setHealthInfo(healthInfo);
    setTotalDonations(totalDonations);
    setTotalRequests(totalRequests);
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
    totalRequests,
    totalDonations,
    setUser,
    setHealthInfo,
    setTotalRequests,
    setTotalDonations,
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
