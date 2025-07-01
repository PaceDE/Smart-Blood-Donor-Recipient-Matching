import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
<<<<<<< HEAD
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
=======
  faHandHoldingDroplet,
  faTruckDroplet,
  faHome,
  faUser,
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';


const Header=({}) =>{
 
>>>>>>> 6979a847025781b94af7134d58720664f63aaa3a

const Header = () => {
  return (
    <div className="sticky top-0 z-50 bg-red-500 h-2z">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="h-6 w-6 text-white"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Smart Blood Donor
                </h1>
                <p className="text-xs text-gray-500">
                  Recipient Matching System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-red-600 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
