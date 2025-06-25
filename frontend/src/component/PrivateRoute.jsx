import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, user, isLoading } = useAuth();

  if(isLoading)
  {
    return <div>Loading..</div>;

  }


 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  
  if (user?.role === "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
