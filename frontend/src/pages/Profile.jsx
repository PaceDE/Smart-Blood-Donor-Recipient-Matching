import React, { useState } from 'react';
import PersonalInfo from '../component/PersonalInfo';
import TopBar from '../component/TopBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faDroplet,
  faPhone,
  faLock,
  faUserLock
} from '@fortawesome/free-solid-svg-icons';
import { faUser as faName, faCalendar, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import HealthInfo from '../component/HealthInfo';
import ChangePassword from '../component/ChangePassword';

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personalInfo");

  return (
    <div>
      <TopBar heading={"My Profile"} text={` Manage your personal information and account settings`} />


      <main className='container min-w-full py-5 px-2 md:px-10 lg:px-30'>
        {/*<div className="logo-text flex flex-col justify-center items-center min-w-full gap-y-0">
        <div className="text-center space-y-2 relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>
        <div className="max-w-2xl text-center">
          <p className="text-lg text-gray-600  mb-4">
            Manage your personal information and account settings
          </p>
        </div>
      </div>
      */}

        <div>
          <div className='rounded-lg mt-6 border border-gray-200 shadow-md'>
            <div className="bg-white border-b-[2px] border-gray-200 w-full h-14 rounded-t-lg flex gap-x-4 sm:gap-x-8 md:gap-x-14 items-center pl-6 text-gray-500 font-medium text-xs sm:text:sm md:text-md lg:text-lg">

              <div
                onClick={() => setActiveTab("personalInfo")}
                className={`h-full -mb[2px] flex justify-center items-center gap-2 border-b-[2px] border-transparent hover:border-gray-400 
                ${activeTab === "personalInfo" ? "!border-red-500 text-red-600 font-semibold" : ""}`}
              >
                <FontAwesomeIcon icon={faName} />
                <p>Personal Info</p>
              </div>

              <div
                onClick={() => setActiveTab("healthInfo")}
                className={`h-full flex justify-center items-center gap-2 border-b-[2px] border-transparent hover:border-gray-400 
                ${activeTab === "healthInfo" ? "!border-red-500 text-red-600 font-semibold" : ""}`}
              >
                <FontAwesomeIcon icon={faDroplet} />
                <p>Health Info</p>
              </div>

              <div
                onClick={() => setActiveTab("changePassword")}
                className={`h-full flex justify-center items-center gap-2 border-b-[2px] border-transparent hover:border-gray-400
                ${activeTab === "changePassword" ? "!border-red-500 text-red-600 font-semibold" : ""} `}
              >
                <FontAwesomeIcon icon={faLock} />
                <p>Change Password</p>
              </div>

            </div>

            <div className="w-full p-10 bg-white" >
              {activeTab === "personalInfo" && <PersonalInfo />}
              {activeTab === "healthInfo" && <HealthInfo/>}
              {activeTab === "changePassword" && <ChangePassword/>}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
