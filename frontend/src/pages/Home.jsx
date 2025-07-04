import React from 'react'
import { useAuth } from '../component/AuthContext';
import { useAppTracking } from '../component/AppTrackingContext';
import TopBar from '../component/TopBar';
import { Users, Droplets, Heart, TrendingUp } from "lucide-react";
import DoughnutChart from '../component/DoughnutChart';

const checkEligibility = (user,healthInfo) => {
    if (!user || !healthInfo) return false;

    const today = new Date();
    const dob = new Date(user.dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    const isAgeValid = age >= 18 && age <= 65;
    const isWeightValid = healthInfo.weight_kg >= 50;

    const lastDonationDate = healthInfo.last_donation_date ? new Date(healthInfo.last_donation_date) : null;
    const lastDonationValid = !lastDonationDate || (today - lastDonationDate) >= 1000 * 60 * 60 * 24 * 60;

    const gaveBirthDate = healthInfo.recently_gave_birth ? new Date(healthInfo.recently_gave_birth) : null;
    const gaveBirthValid = !gaveBirthDate || (today - gaveBirthDate) >= 1000 * 60 * 60 * 24 * 30 * 9;

    const piercingDate = healthInfo.recent_piercing_or_tattoo ? new Date(healthInfo.recent_piercing_or_tattoo) : null;
    const piercingValid = !piercingDate || (today - piercingDate) >= 1000 * 60 * 60 * 24 * 30 * 6;

    const noDisease = !healthInfo.has_disease;

    return isAgeValid && isWeightValid && lastDonationValid && gaveBirthValid && piercingValid && noDisease;
  };

export default function Home() {
  const { user, healthInfo, totalRequests, totalDonations, isLoading } = useAuth();
  const { stats, loading } = useAppTracking();

  const bloodTypeDistribution = stats?.bloodTypeDistribution || {};

  const labels = Object.keys(bloodTypeDistribution);
  const values = Object.values(bloodTypeDistribution);
  const colors = ['#EF4444', '#F97316', '#EAB308', '#84CC16',
    '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6'];

  const milestones = [5, 10, 15, 25, 50, 100];
  const currentMilestone = milestones.find(m => m > totalDonations) || milestones[milestones.length - 1];
  var progress = Math.min(100, ((totalDonations * 100) / currentMilestone));
  progress = progress === 0 ? 1 : progress;

  

  const eligible = checkEligibility(user,healthInfo);

  if (loading || isLoading)
    return <p>Loading...</p>
  return (
    <div className="flex flex-col">
      <TopBar heading={"BloodLink Dashboard"} text={`Welcome back, manage your donations and requests ${user.fullName}`} />
      <main className="flex-1 p-6">

        {/* App Tracking Stats*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="border-l-4 border-l-green-500 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm font-medium text-gray-600">Total Registered Users</p>
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.userGrowth}% from last month
              </p>
            </div>
          </div>

          <div className="border-l-4 border-l-orange-500 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm font-medium text-gray-600">Total Blood requests</p>
              <Heart className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalRequests}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.requestGrowth}% from last month
              </p>
            </div>
          </div>

          <div className="border-l-4 border-l-red-500 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
              <p className="text-sm font-medium text-gray-600">Donation Completed</p>
              <Droplets className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalDonations}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.donationGrowth}% from last month
              </p>
            </div>
          </div>
        </div>

        {/* Personal Tracking Stats*/}
        <div className='bg-white border border-gray-200 p-5 rounded-lg my-6'>
          <div>
            <div className='flex gap-2'>
              <Heart className=" mt-2 h-5 w-5 text-red-500" />
              <h4 className='font-bold text-xl md:text-2xl'>Welcome back, {user.fullName}!</h4>
            </div>
            <p className='text-gray-600'>Your donation journey and impact</p>
          </div>

          <div className='my-5 grid grid-cols-2 md:grid-cols-4 gap-6'>

            <div className='bg-red-50 flex flex-col justify-center items-center p-5 rounded-lg'>
              <p className='text-red-500 text-2xl font-bold'>{totalDonations}</p>
              <p className='text-center text-gray-600'>Total Donations</p>
            </div>

            <div className='bg-orange-50 flex flex-col justify-center items-center p-5 rounded-lg'>
              <p className='text-orange-500 text-2xl font-bold'>{totalRequests}</p>
              <p className='text-center text-gray-600'>Total Requests</p>
            </div>

            <div className='bg-blue-50 flex flex-col justify-center items-center p-5 rounded-lg'>
              <p className='text-blue-500 text-xl font-bold'>{user.bloodType}</p>
              <p className='text-center text-gray-600'>Blood Type</p>
            </div>

            <div className={`flex flex-col justify-center items-center p-5 ${eligible ? 'bg-green-50' : 'bg-red-100'} rounded-lg `}>
              <p className={`text-xl font-bold ${eligible ? 'text-green-500' : 'text-red-600'}`}>
                {eligible ? "Eligible" : "Not Eligible"}
              </p>
              <p className='text-center text-gray-600'>Eligibility</p>
            </div>

          </div>


          <div className='flex justify-between px-2'>
            <p className='text-gray-600'>Progress to next milestone <span className='font-bold'>{` (${currentMilestone} donations)`}</span> </p>
            <p className='text-gray-600'>{totalDonations}/{currentMilestone}</p>
          </div>
          <div className='mt-5 bg-white w-full border border-gray-200 rounded-2xl h-5 p-1 '>
            <div className='h-full bg-red-500 rounded-2xl' style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className='bg-white border border-gray-200 p-5 rounded-lg '>
          <div>
            <h4 className='font-bold text-xl md:text-2xl'>Blood Type Distribution</h4>

            <p className='text-gray-600'>Current distribution of registered donors by blood type</p>
           
            <div className="mt-5 w-[280px] h-[280px] md:w-[450px] md:h-[450px] mx-auto">
              <DoughnutChart labels={labels} values={values} colors={colors} label="Blood Type Count"/>
            </div>
          
          </div>
        </div>


      </main>

    </div>
  );
}

export {checkEligibility};

