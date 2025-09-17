import React, { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import TopBar from "../../component/TopBar";
import { Link } from "react-router";

const UserManagement = () => {
  const [unfilteredUsers, setUnfilteredUsers] = useState([])
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bloodFilter, setBloodFilter] = useState("All");
  const [banFilter, setBanFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const bloodType = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const banStatusType = ["All", "Banned", "Unbanned"];
  const roleType = ["All", "user", "admin"];


  {/* Filtering */ }
  useEffect(() => {

    let filtered = [...unfilteredUsers];

    if (bloodFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.bloodType == bloodFilter
      )
    }

    if (roleFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.role == roleFilter
      )
    }

    if (banFilter !== "All") {
      filtered = filtered.filter((u) =>
        banFilter == "Banned" ? u.ban == true : u.ban == false
      )
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setUsers(filtered);
  }, [bloodFilter, banFilter, roleFilter, searchQuery, unfilteredUsers])


  {/* Fetching User */ }
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
        setUnfilteredUsers(data);
        setUsers(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loading loadingText="Please wait fetching users..." />
  }
  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  if (!users) {
    return <p className="p-4 text-gray-600">No user data found</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar
        heading="BloodLink User Management"
        text="Welcome back to the user management page"
      />

      <main className="flex-1 p-6">

        <div className="flex gap-4 sm:gap-6 md:gap-8 my-4">
          {/* Blood Type Filter */}
          <div>
            <div className="flex flex-col">
              <label className="font-medium">Filter By Blood Type:</label>
              <select
                value={bloodFilter}
                onChange={(e) => setBloodFilter(e.target.value)}
                className=" px-2 py-1 border-b-0 border-2 border-red-200 transition-colors duration-300 ease-linear focus:outline-none focus:border-red-500"
              >
                {bloodType.map((bt) => (
                  <option key={bt} value={bt} style={{ backgroundColor: '#fee2e2', color: '#7f1d1d' }}>{bt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Type Filter */}
          <div>
            <div className="flex flex-col">


              <label className="mr-2 font-medium">Filter By Role Type:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className=" px-2 py-1 border-b-0 border-2 border-red-200 transition-colors duration-300 ease-linear focus:outline-none focus:border-red-500"
              >
                {roleType.map((rt) => (
                  <option key={rt} value={rt} style={{ backgroundColor: '#fee2e2', color: '#7f1d1d' }}>{rt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ban Status Filter */}
          <div>
            <div className="flex flex-col">
              <label className="mr-2 font-medium">Filter By Ban Status:</label>
              <select
                value={banFilter}
                onChange={(e) => setBanFilter(e.target.value)}
                className=" px-2 py-1 border-b-0 border-2 border-red-200 transition-colors duration-300 ease-linear focus:outline-none focus:border-red-500"
              >
                {banStatusType.map((bst) => (
                  <option key={bst} value={bst} style={{ backgroundColor: '#fee2e2', color: '#7f1d1d' }}>{bst}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Field */}
        <div className="search-Field">
          <label htmlFor="searchField">Search by name:</label>
          <input type="text" id="searchField" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type Name..." className="p-2 m-3 border-b-2 border-b-red-200 transition-colors duration-300 ease-linear focus:outline-none focus:border-b-red-500" />

        </div>



        {/* Table */}
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
      </main>
    </div>
  );
};

export default UserManagement;
