import React, { useEffect, useState } from "react";
import Loading from "../component/Loading";
import TopBar from "../component/TopBar";

const MatchLogManagement = () => {
  const [matchlog, setMatchLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchLogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getallmatchlog", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setMatchLog(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchLogs();
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
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Request Blood Type</th>
                  <th className="px-4 py-3">Matched Blood Type </th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Matched At</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {matchlog.map((log, index) => (
                  <tr
                    key={log._id}
                    className="border-t hover:bg-red-50 transition"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{log.request.requester.fullName}</td>
                    <td className="px-4 py-2">{log.donor.fullName}</td>
                    <td className="px-4 py-2">{log.request.bloodType}</td>
                    <td className="px-4 py-2">{log.donorBloodType}</td>
                    <td className="px-4 py-2">{log.distance} {" km"}</td>
                    <td className="px-4 py-2">{log.matchedAt.split("T")[0]}</td>
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
        )}
      </main>
    </div>
  );
};

export default MatchLogManagement;
