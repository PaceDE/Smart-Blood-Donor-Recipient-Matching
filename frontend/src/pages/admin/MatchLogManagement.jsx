import React, { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import TopBar from "../../component/TopBar";
import { Link } from "react-router";
const MatchLogManagement = () => {
  const [unfilteredMatchLog, setUnfilteredMatchLog] = useState([]);
  const [matchlog, setMatchLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bloodFilter, setBloodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const bloodType = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statusType = ["All", "active", "accepted", "declined", "donated", "expired"];

  {/* Filtering */ }
  useEffect(() => {

    let filtered = [...unfilteredMatchLog];

    if (bloodFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.request.bloodType == bloodFilter
        ||
        u.donorBloodType == bloodFilter
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.status == statusFilter
      )
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.request.requester.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        ||
        u.donor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setMatchLog(filtered);
  }, [bloodFilter, statusFilter, searchQuery, unfilteredMatchLog])


  useEffect(() => {
    const fetchMatchLogs = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getallmatchlog",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUnfilteredMatchLog(data);
        setMatchLog(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchLogs();
  }, []);

  if (loading) {
    return <Loading loadingText="Please wait fetching requests..." />
  }
  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  if (!matchlog) {
    return <p className="p-4 text-gray-600">No request data found</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar
        heading="BloodLink Match Log Management"
        text="Welcome back to the match log management page"
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

          {/* Match log Status Filter */}
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

        <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-red-500 text-white">
              <tr>
                <th className="px-4 py-3">SN</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Request Blood Type</th>
                <th className="px-4 py-3">Matched Blood Type </th>
                <th className="px-4 py-3">Distance</th>
                <th className="px-4 py-3">Willingness Probability</th>
                <th className="px-4 py-3">Detail</th>
                <th className="px-4 py-3">Go To</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {matchlog.map((log, index) => (
                <tr
                  key={log._id}
                  className="border-t hover:bg-red-50 transition"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 relative">
                    <Link
                      className="group hover:underline"
                      to="/admin/userdetail"
                      state={{ userId: log.request.requester._id }}
                    >
                      {log.request.requester.fullName}
                      <span className="opacity-0 text-xs bg-gray-300 absolute bottom-0 right-0 hover:opacity-100 group-hover:opacity-100">
                        Click to open profile
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2 relative">
                    <Link
                      className="group hover:underline"
                      to="/admin/userdetail"
                      state={{ userId: log.donor._id }}
                    >
                      {log.donor.fullName}
                      <span className="opacity-0 text-xs bg-gray-300 absolute bottom-0 right-0 group-hover:opacity-100 hover:opacity-100">
                        Click to open profile
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2">{log.request.bloodType}</td>
                  <td className="px-4 py-2">{log.donorBloodType}</td>
                  <td className="px-4 py-2">
                    {log.distance} {" km"}
                  </td>
                  <td className="px-4 py-2">{log.probability}</td>
                  <td className="p-5 capitalize ">
                    <Link
                      className="p-3 rounded-xl bg-[#800000] text-white"
                      to="/admin/matchinglogdetail"
                      state={{ matchLog: log }}
                    >
                      Detail
                    </Link>
                  </td>
                  <td className="p-5 capitalize ">
                    <Link
                      className="p-3 rounded-xl bg-green-500 hover:bg-green-600 hover:bg-gradient-to-r to-green-700 text-white"
                      to="/admin/requestdetail"
                      state={{ req: log.request }}
                    >
                      RequestInfo
                    </Link>
                  </td>
                </tr>
              ))}
              {matchlog.length === 0 && (
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

export default MatchLogManagement;
