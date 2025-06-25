import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Home from './pages/Home';
import SidebarLayout from './component/SidebarLayout';
import Request from './pages/Request';
import Donate from './pages/Donate';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Register from './pages/Register';
import SecondStage from './pages/SecondStage';
import HeaderLayout from './component/HeaderLayout';
import { AuthProvider } from './component/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './component/PrivateRoute';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HeaderLayout />} >
            <Route path="" element={<Welcome />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="next-step" element={<SecondStage />} />

          </Route>


          {/* Private Routes with Sidebar */}
          <Route path="/home" element={<PrivateRoute>
            <SidebarLayout />
            </PrivateRoute>
            }>

            <Route index path="" element={<Home />} />
            <Route path="request" element={<Request />} />
            <Route path="donate" element={<Donate />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="profile" element={<Profile />} />


          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
