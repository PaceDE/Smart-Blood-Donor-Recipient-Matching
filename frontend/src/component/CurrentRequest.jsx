import React from 'react'
import { Users, AlertTriangle, MapPin, Droplet } from 'lucide-react';

const CurrentRequest = ({ existingRequest }) => {
    return (
        <main>
            <div className="border-l-4 border-l-red-500 bg-white rounded-2xl shadow-sm p-6">
                <div className="border-b border-gray-200 py-4 font-semibold text-lg text-red-600">
                    Your Active Blood Request
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-5">
                    {/* Blood Type */}
                    <div className="bg-red-50 p-4 rounded-xl shadow flex flex-col justify-center items-center">
                        <div className="flex justify-center items-center space-x-2">
                            <Droplet className="h-5 w-5 text-red-500" />
                            <p className="text-gray-600 text-sm font-semibold">Blood Type</p>
                        </div>
                        <p className="text-xl font-bold text-red-600 mt-2">{existingRequest.bloodType}</p>
                    </div>

                    {/* Urgency */}
                    <div className="bg-orange-50 p-4 rounded-xl shadow flex flex-col justify-center items-center">
                        <div className="flex justify-center items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <p className="text-gray-600 text-sm font-semibold">Urgency</p>
                        </div>
                        <p className="text-xl font-bold text-orange-600 mt-2">{existingRequest.urgency}</p>
                    </div>

                    {/* Matched Donors */}
                    <div className="bg-green-50 p-4 rounded-xl shadow flex flex-col justify-center items-center">
                        <div className="flex justify-center items-center space-x-2">
                            <Users className="h-5 w-5 text-green-600" />
                            <p className="text-gray-600 text-sm font-semibold">Matched Donors</p>
                        </div>
                        <p className="text-xl font-bold text-green-600 mt-2">{existingRequest.matchedCount}</p>
                    </div>

                    {/* Address */}
                    <div className="bg-blue-50 p-4 rounded-xl shadow flex flex-col justify-center items-center">
                        <div className="flex justify-center items-center space-x-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            <p className="text-gray-600 text-sm font-semibold">Address</p>
                        </div>
                        <p className="text-sm font-semibold text-blue-600 mt-2 text-center">{existingRequest.address}</p>
                    </div>
                </div>

                <div className="p-6 mt-8 bg-gray-50 rounded-lg shadow-inner">
                    <h1 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Request Detail</h1>
                    <p className="mb-2 text-gray-700"><span className="font-semibold">Description:</span> {existingRequest.description}</p>
                    <p className="mb-2 text-gray-700"><span className="font-semibold">Hospital/Facility:</span> {existingRequest.hospital}</p>
                </div>
            </div>


            {/* Donor Responses Container */}
            <div className="mt-8 p-6 rounded-xl shadow-md border border-gray-200  mx-auto">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2 text-center">
                    Donor Responses
                </h2>
                <p className="text-center text-gray-500 italic">No responses yet.</p>
            </div>
        </main>
    );
};

export default CurrentRequest;
