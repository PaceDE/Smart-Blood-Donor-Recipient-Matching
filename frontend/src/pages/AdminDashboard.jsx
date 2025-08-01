import React from "react";
import AppTracking from "../component/AppTracking";
import TopBar from "../component/TopBar";
import Loading from "../component/Loading";
import { useAuth } from "../component/AuthContext";

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
      </main>
    </div>
  );
}
