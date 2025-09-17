import React from "react";
import AppTracking from "../../component/AppTracking";
import TopBar from "../../component/TopBar";
import Loading from "../../component/Loading";
import { useAuth } from "../../component/AuthContext";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  if (isLoading)
    return <Loading loadingText="Please wait while we fetch data..." />;
  return (
    <div className="flex flex-col">
      <TopBar
        heading={"BloodLink Admin Dashboard"}
        text={`Welcome back, manage your donations and requests ${user.fullName}`}
      />
      <main className="flex-1 p-6">
        {/* App Tracking Stats*/}
        <AppTracking />

        <div className='bg-white border border-gray-200 p-5 rounded-lg '>
          <div>
            <h4 className='font-bold text-xl md:text-2xl'>Blood Type Distribution</h4>

            <p className='text-gray-600'>Current distribution of registered donors by blood type</p>

            <div className="mt-5 w-[280px] h-[280px] md:w-[450px] md:h-[450px] mx-auto">
              <DoughnutChart labels={labels} values={values} colors={colors} label="Blood Type Count" />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
