import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../component/TopBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faPhone,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser as faName,
  faCalendar,
  faEnvelope,
} from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function MatchingDetail() {
  const location = useLocation();
  const { matchLog } = location.state || {};
  const navigate = useNavigate();

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchLog) {
      setError("No matchlog provided");
      setLoading(false);
      return;
    }
    const fetchMatchLog = async () => {
      try {
        setLog(matchLog);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchLog();
  }, [matchLog]);

  const handleDelete = async () => {
    if (!log) {
      toast.error("No match log found");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/deletelogbyid/${log._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/admin/matchlogmanagement");
      toast.success("Deletion Successful");
    } catch (err) {
      setError(err.message || "Unknown error");
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  if (!log) {
    return <p className="p-4 text-gray-600">No user data found</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar
        heading="User Detail"
        text="Here is the selected user information"
      />

      <main className="container min-w-full py-5 px-2 md:px-10 lg:px-30">
        <div className="rounded-lg mt-6 border border-gray-200 shadow-md">
          <div className="bg-white border-b-[2px] border-gray-200 w-full h-14 text-black px-5 font-medium flex items-center">
            <p>Request by {log.request.requester.fullName} Matched with </p>
          </div>

          <div className="w-full p-10 bg-white">
            <form className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">
                {/* Req Full Name */}
                <div className="form-element">
                  <label
                    htmlFor="reqFullName"
                    className="text-gray-700 font-medium"
                  >
                    Requester Full Name *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="reqfullName"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={log.request.requester.fullName}
                      readOnly
                    />
                  </div>
                </div>

                {/* Donor Full Name */}
                <div className="form-element">
                  <label
                    htmlFor="donFullName"
                    className="text-gray-700 font-medium"
                  >
                    Donor Full Name *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="donfullName"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={log.donor.fullName}
                      readOnly
                    />
                  </div>
                </div>

                {/* Request Blood Type */}
                <div className="form-element">
                  <label
                    htmlFor="reqbloodType"
                    className="text-gray-700 font-medium"
                  >
                    Request Blood Type *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="reqbloodType"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={log.request.bloodType}
                      readOnly
                    />
                  </div>
                </div>


                {/* Donor Blood Type */}
                <div className="form-element">
                  <label
                    htmlFor="donbloodType"
                    className="text-gray-700 font-medium"
                  >
                    Donor Blood Type *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="donbloodType"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={log.donor.bloodType}
                      readOnly
                    />
                  </div>
                </div>

                {/* Donor Distance */}
                <div className="form-element">
                  <label
                    htmlFor="distance"
                    className="text-gray-700 font-medium"
                  >
                    Donor Distance *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="distance"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={log.distance}
                      readOnly
                    />
                  </div>
                </div>

                {/* Matched Date */}
                <div className="form-element">
                  <label
                    htmlFor="matcheddate"
                    className="text-gray-700 font-medium"
                  >
                    Matched Date *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="matcheddate"
                      type="date"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={log.matchedAt ?
                        new Date(log.matchedAt).toISOString().split('T')[0]
                        : ""
                      }
                      readOnly
                    />
                  </div>
                </div>


                {/* Notification Sent */}
                <div className="form-element">
                  <label
                    htmlFor="notification"
                    className="text-gray-700 font-medium"
                  >
                    Notification Status *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="notification"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={` ${log.notification_sent ? "Sent" : "Not sent"}`}
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-element">
                  <label
                    htmlFor="notificationRead"
                    className="text-gray-700 font-medium"
                  >
                    Notification Read *
                  </label>
                  <div className="relative mt-2">

                    <input
                      id="notificationRead"
                      type="checkbox"
                      className="w-12 h-12"
                      checked={log.read}
                      disabled
                    />
                  </div>
                </div>
                {/*Notification Status*/}
                <div className="form-element">
                  <label
                    htmlFor="logStatus"
                    className="text-gray-700 font-medium"
                  >
                    Log Status *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="logStatus"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={log.status}
                      readOnly
                    />
                  </div>
                </div>


              </div>





              <div className="grid grid-cols-1  gap-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 text-white p-3 rounded-xl"
                >
                  Delete
                </button>

              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MatchingDetail;
