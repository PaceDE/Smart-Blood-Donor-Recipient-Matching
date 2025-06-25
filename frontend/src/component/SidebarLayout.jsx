import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function SidebarLayout() {
  return (
    <div className="flex h-screen"> {/* This is key! */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-red-50 py-15">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
