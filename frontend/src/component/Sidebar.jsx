import React from 'react';
import logo from '../assets/bloodlink-logo.svg';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from './AuthContext';
import {
  faHandHoldingDroplet,
  faTruckDroplet,
  faHome,
  faUser,
  faCircleQuestion,
  faBars,
  faXmark,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { Droplets } from 'lucide-react';

const menuItems = [
  { path: '/home/request', label: 'Request', icon: faHandHoldingDroplet },
  { path: '/home/donate', label: 'Donate', icon: faTruckDroplet },
  { path: '/home', label: 'Home', icon: faHome },
  { path: '/home/profile', label: 'Profile', icon: faUser },
  { path: '/home/about', label: 'About Us', icon: faCircleQuestion }
];
import OneSignal from 'react-onesignal';

const Sidebar=()=> {
  const location = useLocation();
  const {logout} = useAuth();
  const navigate =useNavigate();

  const handleLogout = async () => {
    await logout();
    await OneSignal.removeExternalUserId();
    navigate("/");
  };

  return (
     <>
      {/* Sidebar Toggle (Checkbox Hack) */}
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      {/* Hamburger for small devices */}
      <label htmlFor="sidebar-toggle" className="sm:hidden fixed top-6 left-4 z-30 bg-white border border-gray-200 p-2 rounded shadow-md cursor-pointer">
        <FontAwesomeIcon icon={faBars} className="text-xl text-red-600" />
      </label>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-100 shadow-xl z-40
          w-28 transition-transform duration-300 sm:relative
          -translate-x-full peer-checked:translate-x-0 sm:translate-x-0
        `}
      >
      <div className="h-full flex flex-col justify-center items-center">
         <label htmlFor="sidebar-toggle" className="sm:hidden cursor-pointer absolute top-2 right-3 bg-white border border-gray-200 px-2 py-1 shadow">
        <FontAwesomeIcon icon={faXmark} className="text-xl text-red-600" />
      </label>
        <div className="absolute top-12">
          <img src={logo}/>
        </div>
        
        <nav className="mt-14 w-full">
          <ul className="flex flex-col items-center space-y-6">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={index} className="w-full flex justify-center">
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center p-3 w-20 transition-all duration-300 ease-in-out 
                      ${isActive 
                        ? 'text-white text-sm bg-red-500 rounded-xl shadow-lg transform -translate-y-1' 
                        : 'text-red-500 hover:bg-red-50 rounded-xl hover:shadow-sm'
                      }`}
                  >
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className={`text-xl mb-2 ${isActive ? 'scale-110 text-white' : 'text-red-500'}`} 
                    />
                    <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-red-500'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-5 text-red-400 text-xs text-center opacity-70">
          © 2025 <br />
          
        </div>
      </div>
    </aside>
    </>
   
  );
}

export default Sidebar;