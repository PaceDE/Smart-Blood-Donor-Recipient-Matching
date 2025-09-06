import React, { useEffect, useState } from "react";
import Loading from "../component/Loading";
import TopBar from "../component/TopBar";
import { Link } from "react-router";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getallusers", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar
        heading="BloodLink User Management"
        text="Welcome back to the user management page"
      />

      <main className="flex-1 p-6">
        {loading && <Loading loadingText="Please wait fetching users..." />}
        {error && (
          <p className="text-red-600 text-center text-sm mb-4">
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="px-4 py-3">SN</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Blood Type</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-red-50 transition"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.fullName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    <td className="px-4 py-2">{user.bloodType}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    
                    <td className="p-5 capitalize ">
                      <Link className="p-3 rounded-xl bg-[#800000] text-white"
                        to="/admin/userdetail"
                        state={{ userId: user._id }}
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500 bg-gray-50"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
