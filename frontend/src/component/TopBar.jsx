import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faUser,
 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './AuthContext';

const TopBar = ({ heading, text }) => {
  const { user,logout } = useAuth();
  const navigate = useNavigate();
                                  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="flex justify-between bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="pl-10 sm:pl-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">{heading}</h1>
          <p className="text-gray-600">{text}</p>
        </div>
      </div>
      <div className='flex'>
        <Link
          to={user.role=="user"? "/home/profile" : "/admin/profile"}
          className="flex flex-col items-center p-3 w-20 text-red-500 hover:bg-red-50 rounded-xl hover:shadow-sm transition-all duration-300"
        >

          <FontAwesomeIcon
            icon={faUser}
            className="text-xl mb-2"
          />
          <span className="text-xs font-medium">
            Profile
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-3 w-20 text-red-500 hover:bg-red-50 rounded-xl hover:shadow-sm transition-all duration-300"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="text-xl mb-2" />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>

    </header>
  )
}
export default TopBar;
