import React, { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import TopBar from "../../component/TopBar";
import { Link } from "react-router";

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [unfilteredRequests, setUnfilteredRequests] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bloodFilter, setBloodFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const bloodType = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyType = ["All", "Low", "High", "Critical"];
  const statusType = ["All", "pending", "completed", "cancelled"];

  {/* Filtering */ }
  useEffect(() => {

    let filtered = [...unfilteredRequests];

    if (bloodFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.bloodType == bloodFilter
      )
    }

    if (urgencyFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.urgency == urgencyFilter
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.status == statusFilter
      )
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.requester.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setRequests(filtered);
  }, [bloodFilter, urgencyFilter, statusFilter, searchQuery, unfilteredRequests])



  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getallrequests", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch request");
        const data = await response.json();
        setUnfilteredRequests(data)
        setRequests(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, []);

  if (loading) {
    return <Loading loadingText="Please wait fetching requests..." />
  }
  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  if (!requests) {
    return <p className="p-4 text-gray-600">No request data found</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar
        heading="BloodLink Request Management"
        text="Welcome back to the request management page"
      />

      <main className="flex-1 p-6">

        <div className="flex gap-4 sm:gap-6 md:gap-8 my-4">
          {/* Blood Type Filter */}
          <div>
            <div className="flex flex-col">
              <label className="mr-2 font-medium">Filter By Blood Type:</label>
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

          {/* Urgency Filter */}
          <div>
            <div className="flex flex-col">
              <label className="mr-2 font-medium">Filter By Urgency Level:</label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className=" px-2 py-1 border-b-0 border-2 border-red-200 transition-colors duration-300 ease-linear focus:outline-none focus:border-red-500"
              >
                {urgencyType.map((ut) => (
                  <option key={ut} value={ut} style={{ backgroundColor: '#fee2e2', color: '#7f1d1d' }}>{ut}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Request Status Filter */}
          <div>
            <div className="flex flex-col">
              <label className="mr-2 font-medium">Filter By Request Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className=" px-2 py-1 border-b-0 border-2 border-red-200 transition-colors duration-300 ease-linear focus:outline-none focus:border-red-500"
              >
                {statusType.map((st) => (
                  <option key={st} value={st} style={{ backgroundColor: '#fee2e2', color: '#7f1d1d' }}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
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
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Request blood Type</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">SearchDistance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {requests.map((request, index) => (
                <tr
                  key={request._id}
                  className="border-t hover:bg-red-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 relative">
                    <Link 
                      className="group hover:underline"
                      to="/admin/userdetail"
                      state={{ userId: request.requester._id }}
                    >
                      {request.requester.fullName}
                      <span className="opacity-0 text-xs bg-gray-300 absolute bottom-0 right-0 group-hover:opacity-100">
                        Click to open profile
                      </span>
                    </Link>
                    
                  </td>
                  <td className="px-4 py-2">{request.bloodType}</td>
                  <td className="px-4 py-2">{request.urgency}</td>
                  <td className="px-4 py-2">{request.hospital}</td>
                  <td className="px-4 py-2 capitalize">{request.searchDistance}{" km"}</td>
                  <td className="px-4 py-2 capitalize">{request.status}</td>
                  <td className="p-5 capitalize ">
                    <Link className="p-3 rounded-xl bg-[#800000] text-white"
                      to="/admin/requestdetail"
                      state={{ req: request }}
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
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

export default RequestManagement;
