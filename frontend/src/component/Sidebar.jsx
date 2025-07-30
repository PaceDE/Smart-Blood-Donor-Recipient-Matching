import React, { useState, useEffect } from 'react';
import logo from '../assets/bloodlink-logo.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import {
  faHandHoldingDroplet,
  faTruckDroplet,
  faHome,
  faCircleQuestion,
  faBars,
  faXmark,
 
} from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

const menuItems = [
  { path: '/home/request', label: 'Request', icon: faHandHoldingDroplet },
  { path: '/home/donate', label: 'Donate', icon: faTruckDroplet },
  { path: '/home', label: 'Home', icon: faHome },
  { path: '/home/reviews', label: 'Reviews', icon: faComment },
];
import OneSignal from 'react-onesignal';

const Sidebar = ({ donateSectionUnread,setDonateSectionUnread, requestSectionUnread , setRequestSectionUnread }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { socket, messages, messageLoading } = useSocket();
  const [donateSectionMsg, setDonateSectionMsg] = useState(0);
  const [requestSectionMsg, setRequestSectionMsg] = useState(0);
  
  useEffect(() => {
  let page;
  if (location.pathname.includes("request")) page = "request";
  else if (location.pathname.includes("donate")) page = "donate";
  console.log("Page: ",page)

  const markLogRead = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/markLogRead/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to mark as read');
      }

      // Reset unread counts
      if (page === "donate") {
        setDonateSectionUnread(0);
      } 
      else if (page === "request") {
        setRequestSectionUnread(0);
      }

    } catch (err) {
      console.error(err);
    }
  };

  if ((page === "donate" || page === "request") && (donateSectionUnread>0 || requestSectionUnread>0)) {
    markLogRead();
  }

}, [location.pathname]);

  useEffect(() => {
    let donateCount = 0;
    let requestCount = 0;

    for (const msg of messages) {

      if (msg.recipient === user._id && msg.status === "sent") {
        if (msg.recipientRole === "donor") {
          donateCount++;
        } else {
          requestCount++;
        }
      }
    }

    setDonateSectionMsg(donateCount);
    setRequestSectionMsg(requestCount);
  }, [messages, user._id]);
  const navigate = useNavigate();

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
                      {index === 0 && requestSectionMsg > 0 && (
                        <span className="absolute top-1 right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                          {requestSectionMsg}
                        </span>
                      )}
                       {index === 0 && requestSectionUnread > 0 && (
                        <span className="absolute top-1 left-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                          {requestSectionUnread}
                        </span>
                      )}


                      {index === 1 && donateSectionMsg > 0 && (
                        <span className="absolute top-1 right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                          {donateSectionMsg}
                        </span>
                      )}
                      {index === 1 && donateSectionUnread > 0 && (
                        <span className="absolute top-1 left-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                          {donateSectionUnread}
                        </span>
                      )}

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