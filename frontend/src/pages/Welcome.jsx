import React from 'react'
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-red-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Smart Blood Donor System</h1>
      <p className="text-gray-700 max-w-lg text-center mb-6">
        Our service connects blood donors with recipients efficiently using smart matching algorithms.
      </p>
      <div className="flex x">

        <Link
          to="/login"
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
         >
          Login
        </Link>

        <Link
          to="/register"
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
