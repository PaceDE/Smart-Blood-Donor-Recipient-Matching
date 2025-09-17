import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Loading from "../Loading";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user, isLoading } = useAuth();

  if(isLoading){
    return( <Loading loadingText="Fetching User data..." />)
  }
 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
