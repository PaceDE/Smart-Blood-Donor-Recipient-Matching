import React from 'react'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router'

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar/>
      <main className="flex-1 overflow-y-auto bg-[#f9fafb]">
        <Outlet/>
      </main>
    </div>
  )
}
export default AdminLayout;
