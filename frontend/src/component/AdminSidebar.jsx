import React from 'react';
import logo from '../assets/bloodlink-logo.svg';
import { Link, useLocation} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faHandHoldingDroplet,
  faTruckDroplet,
  faHome,
  faBars,
  faXmark,
 
} from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

const menuItems = [
  { path: '/admin/requestmanagement', label: 'Request', icon: faHandHoldingDroplet },
  { path: '/admin/usermanagement', label: 'User', icon: faTruckDroplet },
  { path: '/admin/dashboard', label: 'Dashboard', icon: faHome },
  { path: '/admin/matchlogmanagement', label: 'Match Log', icon: faComment },
   { path: '/admin/donationmanagement', label: 'Donation', icon: faComment },
];

const AdminSidebar = () => {
  const location = useLocation();
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
            <img src={logo} />
          </div>

          <nav className="mt-14 w-full">
            <ul className="flex flex-col items-center space-y-6">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;

                return (
                  <li key={index} className="w-full flex justify-center">
                    <Link
                      to={item.path}
                      className={`relative flex flex-col items-center p-3 w-20 transition-all duration-300 ease-in-out 
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

export default AdminSidebar;