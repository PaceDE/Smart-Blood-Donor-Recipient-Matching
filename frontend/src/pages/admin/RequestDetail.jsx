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

function RequestDetail() {
  const location = useLocation();
  const { req } = location.state || {};
  const navigate = useNavigate();

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!req) {
      setError("No request selected provided");
      setLoading(false);
      return;
    }
    const fetchRequest = async () => {
      try {
        setRequest(req)
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [req]);

  const handleDelete = async () => {
    if (!request) {
      toast.error("No use provided");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/deleterequestbyid/${request._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/admin/requestmanagement");
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

  if (!request) {
    return <p className="p-4 text-gray-600">No Request data found</p>;
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
            <p>Request By {request.requester.fullName}</p>
          </div>

          <div className="w-full p-10 bg-white">
            <form className="space-y-6">
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">
                {/* Requester Full Name */}
                <div className="form-element">
                  <label
                    htmlFor="fullName"
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
                      id="fullName"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.requester.fullName}
                      readOnly
                    />
                  </div>
                </div>

                {/* Request Blood Type */}
                <div className="form-element">
                  <label
                    htmlFor="bloodType"
                    className="text-gray-700 font-medium"
                  >
                    Request Blood type *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="bloodType"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.bloodType}
                      readOnly
                    />
                  </div>
                </div>

                {/* Urgency */}
                <div className="form-element">
                  <label
                    htmlFor="urgency"
                    className="text-gray-700 font-medium"
                  >
                    Urgency *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="urgency"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.urgency}
                      readOnly
                    />
                  </div>
                </div>

                {/* Urgency */}
                <div className="form-element">
                  <label
                    htmlFor="hospital"
                    className="text-gray-700 font-medium"
                  >
                    Hospital *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="hospital"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.hospital}
                      readOnly
                    />
                  </div>
                </div>

                 {/* Description */}
                <div className="form-element">
                  <label
                    htmlFor="description"
                    className="text-gray-700 font-medium"
                  >
                    Hospital *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="description"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.description}
                      readOnly
                    />
                  </div>
                </div>

                {/* Request Address */}
                <div className="form-element">
                  <label
                    htmlFor="reqAddress"
                    className="text-gray-700 font-medium"
                  >
                    Request Address *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="reqAddress"
                      type="textarea"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.address}
                      readOnly
                    />
                  </div>
                </div>

                {/* Searcch Distance */}
                <div className="form-element">
                  <label
                    htmlFor="searchdistance"
                    className="text-gray-700 font-medium"
                  >
                    Search Distance *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="searchdistance"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.searchDistance + " km"}
                      readOnly
                    />
                  </div>
                </div>

                {/* Searcch Distance */}
                <div className="form-element">
                  <label
                    htmlFor="status"
                    className="text-gray-700 font-medium"
                  >
                    Status *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="status"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={request.status}
                      readOnly
                    />
                  </div>
                </div>


                
            
              </div>

              <div className="grid grid-cols-1">
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

export default RequestDetail;
