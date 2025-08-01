import React from "react";
import { useAppTracking } from "./AppTrackingContext";
import { Users, Droplets, Heart, TrendingUp } from "lucide-react";
import Loading from "./Loading";

const AppTracking = () =>{
    const { stats, loading } = useAppTracking();
    if (loading)
        return <Loading loadingText="Please wait while we fetch data..." />;
    return(
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
    );

}
export default AppTracking;