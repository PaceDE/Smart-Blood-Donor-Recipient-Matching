import React, { useEffect, useState } from 'react'
import { Users, AlertTriangle, MapPin, Droplet, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const CurrentRequest = ({ existingRequest }) => {
    const [loading, setLoading] = useState(false);
    const [acceptedLog, setAcceptedLog] = useState([]);
    const [filteredLog, setFilteredLog] = useState([])

    useEffect(() => {
        const fetchAcceptedLogs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/acceptedLog/${existingRequest._id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch Accepted logs');
                }

                const data = await response.json();
                setAcceptedLog(data.logs);
                setFilteredLog(data.logs);
            } catch (error) {
                console.error('Error fetching matched logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAcceptedLogs();
    }, []);

    const handleStatusUpdate = async (status) => {
        try {
            const res = await fetch(`http://localhost:5000/api/updateRequest/${existingRequest._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }), // Send status: 'completed' or 'cancelled'
            });

            if (!res.ok) {
                throw new Error('Failed to cancel request');
            }

            toast.success('Request cancelled successfully!');
            setTimeout(() => { window.location.reload() }, 1500);
        } catch (err) {
            console.error(err);
            toast.error('Failed to cancel request');
        }
    };

    const handleLogStatus = async (logId, newStatus) => {
        try {
          const response = await fetch(`http://localhost:5000/api/updateMatchLog/${logId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status: newStatus }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to update status');
          }
    
          toast.success(`Status updated to '${newStatus}'`);
          setTimeout(() => window.location.reload(), 1500)
        } catch (err) {
          console.error('Status update failed:', err);
          toast.error(`Failed to Update Status'`);
        }
      };

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

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => handleStatusUpdate('canceled')}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition duration-200"
                    >
                        <XCircle className="h-4 w-4" />
                        Cancel Request
                    </button>

                    <button
                        onClick={() => handleStatusUpdate('completed')}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition duration-200"
                    >
                        <CheckCircle className="h-4 w-4" />
                        Request Completed
                    </button>
                </div>
            </div>


            {/* Matching Request Results */}
            <div className=" p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredLog.length > 0 ? (
                    filteredLog.map((log, index) => (
                        <div
                            key={index}
                            className="border p-6 rounded-2xl shadow-xl border-red-200 text-gray-800 bg-white hover:shadow-2xl transition duration-200 mb-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-white font-bold text-lg rounded-full w-12 h-12 bg-blue-600 flex justify-center items-center shadow-md">
                                        {log.fullName?.split(' ').map(name => name[0].toUpperCase()).join('') || '?'}
                                    </div>
                                    <div>
                                        <h1 className="font-semibold text-xl">{log.fullName || 'Unknown Name'}</h1>
                                        <p className="text-sm text-gray-500">{log.email}</p>

                                    </div>

                                </div>

                                <div>
                                    <div className={`text-center font-medium px-1 lg:px-5 py-1 rounded-full text-base animate-pulse ${log.urgency === 'Critical' ? 'bg-red-500 text-white' :
                                        log.urgency === 'High' ? 'bg-orange-400 text-white' :
                                            log.urgency === 'Medium' ? 'bg-yellow-300 text-gray-800' :
                                                'bg-green-200 text-green-900'
                                        }`}>
                                        {log.urgency}
                                    </div>
                                    {log.status === 'accepted' &&
                                        (<div className="mt-3 font-medium px-3 lg:px-5 py-1 rounded-full text-base bg-green-200 text-green-900">
                                            Accepted
                                        </div>
                                        )}
                                </div>

                            </div>

                            <div className="space-y-2 text-sm leading-relaxed">
                                <p className="text-gray-600 text-sm flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {log.distance} km away.
                                </p>
                                
                                <p>
                                    <span className="font-medium text-gray-700">Location:</span>{' '}
                                    {log.address}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-700">Phone:</span>{' '}
                                    <a href={`tel:${log.phone}`} className="text-blue-600 hover:underline">{log.phone}</a>
                                </p>

                                <div className='border border-gray-200 rounded-lg p-5'>
                                    {log.description}
                                </div>
                            </div>

                            <div className="actions mt-4">                              
                                    <div className="grid grid-cols-1 gap-2 font-bold">
                                        <button className="bg-red-500  hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                                            Start a Conversation
                                        </button>
                                        <button onClick={() => handleLogStatus(log._id, 'declined')} className="bg-white border border-red-500 hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm">
                                            Decline
                                        </button>
                                    </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">
                        No Accepetd matching blood requests found.
                    </p>
                )}
            </div>
        </main>
    );
};

export default CurrentRequest;
