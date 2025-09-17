import React, { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import TopBar from "../../component/TopBar";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";

const DonationManagement = () => {

  const [unfilteredDonation, setUnfilteredDonation] = useState([]);
  const [donationhistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [bloodFilter, setBloodFilter] = useState("All");
  const bloodType = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [searchQuery, setSearchQuery] = useState("");

  {/* Filtering */ }
  useEffect(() => {

    let filtered = [...unfilteredDonation];

    if (bloodFilter !== "All") {
      filtered = filtered.filter((u) =>
        u.request.bloodType == bloodFilter
        ||
        u.donor.bloodType == bloodFilter
      )
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((u) =>
        u.recipient.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        ||
        u.donor.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setDonationHistory(filtered);
  }, [bloodFilter, searchQuery, unfilteredDonation])


  const handleDelete = async (history) => {

    try {
      const response = await fetch(
        `http://localhost:5000/api/deletedonationbyid/${history._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
      toast.success("Deletion Successful")

    } catch (err) {
      setError(err.message || "Unknown error");
    }
  };

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/getalldonationhistory",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch donationhistory");
        const data = await response.json();
        setUnfilteredDonation(data);
        setDonationHistory(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  if (loading) {
    return <Loading loadingText="Please wait fetching requests..." />
  }
  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  if (!donationhistory) {
    return <p className="p-4 text-gray-600">No request data found</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar
        heading="BloodLink Donation Log Management"
        text="Welcome back to the donation log management page"
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

        </div>

        {/* Search Field */}
        <div className="search-Field">
          <label htmlFor="searchField">Search by name:</label>
          <input type="text" id="searchField" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type Name..." className="p-2 m-3 border-b-2 border-b-red-200 transition-colors duration-300 ease-linear focus:outline-none focus:border-b-red-500" />

        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-red-500 text-white">
              <tr className="text-center">
                <th className="px-4 py-3">SN</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Request Blood Type</th>
                <th className="px-4 py-3">Matched Blood Type </th>
                <th className="px-4 py-3">Review </th>
                <th className="px-4 py-3">Donated At </th>
                <th className="px-4 py-3">Action </th>
                <th className="px-4 py-3 text-center" colSpan={2}>Go To </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {donationhistory.map((history, index) => (
                <tr
                  key={history._id}
                  className="border-t hover:bg-red-50 transition text-center"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 relative">
                    <Link
                      className="group hover:underline"
                      to="/admin/userdetail"
                      state={{ userId: history.recipient._id }}
                    >
                      {history.recipient.fullName}
                      <span className="opacity-0 text-xs bg-gray-300 absolute bottom-0 right-0 hover:opacity-100 group-hover:opacity-100">
                        Click to open profile
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2 relative">
                    <Link
                      className="group hover:underline"
                      to="/admin/userdetail"
                      state={{ userId: history.donor._id }}
                    >
                      {history.donor.fullName}
                      <span className="opacity-0 text-xs bg-gray-300 absolute bottom-0 right-0 group-hover:opacity-100 hover:opacity-100">
                        Click to open profile
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2">{history.request.bloodType}</td>
                  <td className="px-4 py-2">{history.donor.bloodType}</td>
                  <td className="px-4 py-2">

                    <span title={history.review}>
                      {history.review?.length > 50
                        ? history.review.slice(0, 50) + "..."
                        : history.review || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {history.donatedAt.split("T")[0]}
                  </td>
                  <td className="p-5 capitalize ">
                    <Link className="p-3 rounded-xl bg-red-500 hover:bg-red-600 hover:bg-gradient-to-r to-red-700 text-white"
                      onClick={() => handleDelete(history)}
                    >
                      Delete
                    </Link>
                  </td>
                  <td className="p-5 capitalize ">
                    <Link
                      className="p-3 rounded-xl bg-green-500 hover:bg-green-600 hover:bg-gradient-to-r to-green-700 text-white"
                      to="/admin/matchinglogdetail"
                      state={{ matchLog: history.log }}
                    >
                      Matchlog
                    </Link>
                  </td>
                  <td className="p-5 capitalize ">
                    <Link
                      className="p-3 rounded-xl bg-green-500 hover:bg-green-600 hover:bg-gradient-to-r to-green-700 text-white"
                      to="/admin/requestdetail"
                      state={{ req: history.request }}
                    >
                      RequestInfo
                    </Link>
                  </td>
                  
                  
                </tr>
              ))}
              {donationhistory.length === 0 && (
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

export default DonationManagement;
