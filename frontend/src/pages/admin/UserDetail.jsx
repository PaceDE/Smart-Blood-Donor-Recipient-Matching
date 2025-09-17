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

function UserDetail() {
  const location = useLocation();
  const { userId } = location.state || {};
  const navigate = useNavigate();

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [users, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/getuserbyid/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleDelete = async () => {
    if (!userId) {
      toast.error("No user ID provided");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/deleteuserbyid/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/admin/usermanagement");
      toast.success("Deletion Successful");
    } catch (err) {
      setError(err.message || "Unknown error");
    }
  };
  const handleBan = async (status) => {
    if (!userId) {
      toast.error("No user ID provided");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/banuserbyid/${userId}/${status}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(status==1){
        toast.success("Ban Successful");
      } else{
        toast.success("Unban Successful");

      }
      setTimeout(() => {
      window.location.reload();
    }, 2000);
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

  if (!users) {
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
            <p>User info of {users.user.fullName}</p>
          </div>

          <div className="w-full p-10 bg-white">
            <form className="space-y-6">
              {/*Personal Info */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-400"></div>
                <span className="px-3 text-gray-600">Personal Info</span>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">
                {/* Full Name */}
                <div className="form-element">
                  <label
                    htmlFor="fullName"
                    className="text-gray-700 font-medium"
                  >
                    Full Name *
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
                      value={users.user.fullName}
                      readOnly
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="form-element">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-gray-700 font-medium"
                  >
                    Date of Birth *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="dateOfBirth"
                      type="date"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={
                        users.user.dateOfBirth
                          ? new Date(users.user.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="form-element">
                  <label htmlFor="gender" className="text-gray-700 font-medium">
                    Gender *
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      id="gender"
                      className="pl-3 rounded-md w-full h-12 border border-gray-300"
                      value={users.user.gender}
                      readOnly
                    ></input>
                  </div>
                </div>

                {/* Blood Type */}
                <div className="form-element">
                  <label
                    htmlFor="bloodType"
                    className="text-gray-700 font-medium"
                  >
                    Blood Type *
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      id="bloodType"
                      className="pl-3 rounded-md w-full h-12 border border-gray-300"
                      value={users.user.bloodType}
                      disabled
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-element">
                  <label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="email"
                      type="email"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={users.user.email}
                      readOnly
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="form-element">
                  <label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="phone"
                      type="tel"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={users.user.phone}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="form-element">
                <label className="text-gray-700 font-medium">Address *</label>
                <div className="relative mt-2">
                  <FontAwesomeIcon
                    icon={faLocation}
                    className="absolute left-3 top-4 text-gray-400"
                  />
                  <input
                    type="text"
                    className="pl-10 rounded-md w-full h-12 border border-gray-300"
                    value={users.user.address}
                    readOnly
                  />
                </div>
              </div>

              {/*Health Info */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-400"></div>
                <span className="px-3 text-gray-600">Health Info</span>
                <div className="flex-1 border-t border-gray-400"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">
                {/* Full Name */}
                <div className="form-element">
                  <label
                    htmlFor="totalDonations"
                    className="text-gray-700 font-medium"
                  >
                    Total Donations *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faName}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="totalDonations"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={users.total_donations}
                      readOnly
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="form-element">
                  <label
                    htmlFor="lastDonationDate"
                    className="text-gray-700 font-medium"
                  >
                    Last Donation Date *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="lastDonationDate"
                      type="date"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={
                        users.last_donation_date
                          ? new Date(users.last_donation_date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-element">
                  <label
                    htmlFor="hasDiseases"
                    className="text-gray-700 font-medium"
                  >
                    Has diseases *
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="checkbox"
                      id="hasDiseases"
                      className="pl-3 rounded-md w-12 h-12 border border-gray-300"
                      checked={users.has_disease}
                      disabled
                    ></input>
                  </div>
                </div>

                {users.user.gender === "Female" && (
                  <div className="form-element">
                    <label
                      htmlFor="recentlyGB"
                      className="text-gray-700 font-medium"
                    >
                      Recently gave birth *
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="date"
                        id="recentlyGB"
                        className="pl-3 rounded-md w-full h-12 border border-gray-300"
                        value={
                          users.last_donation_date
                            ? new Date(users.last_donation_date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        readOnly
                      ></input>
                    </div>
                  </div>
                )}

                <div className="form-element">
                  <label
                    htmlFor="piercingORtatto"
                    className="text-gray-700 font-medium"
                  >
                    Recently piercing or tattoo *
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="date"
                      id="piercingORtatto"
                      className="pl-3 rounded-md w-full h-12 border border-gray-300"
                      value={
                        users.recent_piercing_or_tattoo
                          ? new Date(users.recent_piercing_or_tattoo)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      readOnly
                    ></input>
                  </div>
                </div>

                {/* Blood Type */}
                <div className="form-element">
                  <label htmlFor="weight" className="text-gray-700 font-medium">
                    Weight *
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      id="weight"
                      className="pl-3 rounded-md w-full h-12 border border-gray-300"
                      value={users.weight_kg}
                      readOnly
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-element">
                  <label htmlFor="wl" className="text-gray-700 font-medium">
                    Willingness Level *
                  </label>
                  <div className="relative mt-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-3 top-4 text-gray-400"
                    />
                    <input
                      id="wl"
                      type="text"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300"
                      value={users.willingness_level}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 text-white p-3 rounded-xl"
                >
                  Delete
                </button>
                {users.user.ban ? (
                  <button
                    type="button"
                    onClick={() => handleBan(2)}
                    className="bg-yellow-500 text-white p-3 rounded-xl"
                  >
                    UnBan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBan(1)}
                    className="bg-yellow-500 text-white p-3 rounded-xl"
                  >
                    Ban
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDetail;
