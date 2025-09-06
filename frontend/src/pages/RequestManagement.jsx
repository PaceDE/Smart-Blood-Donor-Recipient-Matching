import React, { useEffect, useState } from "react";
import Loading from "../component/Loading";
import TopBar from "../component/TopBar";
import { Link } from "react-router";

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setRequests(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar
        heading="BloodLink User Management"
        text="Welcome back to the user management page"
      />

      <main className="flex-1 p-6">
        {loading && <Loading loadingText="Please wait fetching request..." />}
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
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Request blood Type</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">SearchDistance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Detail</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {requests.map((request, index) => (
                  <tr
                    key={request._id}
                    className="border-t hover:bg-red-50 transition"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{request.requester.fullName}</td>
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
        )}
      </main>
    </div>
  );
};

export default RequestManagement;
