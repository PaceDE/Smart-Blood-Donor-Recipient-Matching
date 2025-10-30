import React from 'react'
import { Link } from 'react-router';
import {
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Smart Blood Donor</h3>
                  <p className="text-gray-400 text-sm">
                    Recipient Matching System
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Connecting donors with recipients through advanced AI matching
                technology. Every donation saves up to 3 lives.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/#watch-demo" className="hover:text-white transition-colors">
                    Watch Demo
                  </Link>
                </li>
                <li>
                  <Link to="/#stats" className="hover:text-white transition-colors">
                    See How We're Doing
                  </Link>
                </li>
                <li>
                  <Link to="/#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>   
                <li>
                  <Link to="/#become-a-member" className="hover:text-white transition-colors">
                    Become a Member
                  </Link>
                </li>
                
            
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              © 2025 Smart Blood Donor Recipient Matching System. All rights
              reserved.
            </p>
            <p className="mt-2">
              Saving lives through technology and community.
            </p>
          </div>
        </div>
      </footer>
  )
}
