import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SidebarLayout from "./component/SidebarLayout";
import Request from "./pages/Request";
import Donate from "./pages/Donate";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import SecondStage from "./pages/SecondStage";
import HeaderLayout from "./component/HeaderLayout";
import { AuthProvider } from "./component/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./component/PrivateRoute";
import { AppTrackingProvider } from "./component/AppTrackingContext";
import { SocketProvider } from "./component/SocketContext";
import Reviews from "./pages/Reviews";

import AdminLayout from "./component/admin/AdminLayout";

import Unauthorized from "./pages/Unauthorized";
import UserManagement from "./pages/admin/UserManagement";
import RequestManagement from "./pages/admin/RequestManagement";
import MatchLogManagement from "./pages/admin/MatchLogManagement";
import DonationManagement from "./pages/admin/DonationManagement";
import UserDetail from "./pages/admin/UserDetail";
import RequestDetail from "./pages/admin/RequestDetail";
import MatchingDetail from "./pages/admin/MatchingDetail";
function App() {
  return (
    <AppTrackingProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HeaderLayout />}>
                <Route path="" element={<Welcome />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="next-step" element={<SecondStage />} />
              </Route>

              <Route
                path="/home"
                element={
                  <PrivateRoute requiredRole="user">
                    <SidebarLayout />
                  </PrivateRoute>
                }
              >
                <Route index path="" element={<Home />} />
                <Route path="request" element={<Request />} />
                <Route path="donate" element={<Donate />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="history" element={<Reviews />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index path="dashboard" element={<Home />} />
                <Route path="usermanagement" element={<UserManagement />} /> 
                <Route path="requestmanagement" element={<RequestManagement />} />
                <Route path="matchlogmanagement" element={<MatchLogManagement />} />  
                <Route path="donationmanagement" element={<DonationManagement />} /> 
                <Route path="userdetail" element={<UserDetail />} /> 
                <Route path="requestdetail" element={<RequestDetail />} />
                <Route path="matchinglogdetail" element={<MatchingDetail />} />
                <Route path="profile" element={<Profile />} />   
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </AppTrackingProvider>
  );
}

export default App;
