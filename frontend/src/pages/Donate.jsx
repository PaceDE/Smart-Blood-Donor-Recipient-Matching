import React, { useState, useEffect } from 'react';
import TopBar from '../component/TopBar';
import Loading from '../component/Loading';
import { toast } from 'react-toastify';
import { MapPin } from 'lucide-react';

const Donate = () => {
  const [filterUrgency, setFilterUrgency] = useState('');
  const [matchedLog, setMatchedLog] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    const fetchMatchedLogs = async () => {
      try {
        setIsloading(true);

        const response = await fetch('http://localhost:5000/api/matchedLog', {
          method: 'GET',
          credentials: 'include', // if using cookies/sessions
        });

        if (!response.ok) {
          throw new Error('Failed to fetch matched logs');
        }

        const data = await response.json();
        setMatchedLog(data);
      } catch (error) {
        console.error('Error fetching matched logs:', error);
      } finally {
        setIsloading(false);
      }
    };

    fetchMatchedLogs();
  }, []);

  // Inside the Donate component

  const handleStatusUpdate = async (logId, newStatus) => {
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
    <div className="flex flex-col">
      <TopBar
        heading={"Donate Now"}
        text={`As a donor, you can view and respond to nearby blood requests `}
      />

      {isLoading ? (
        <Loading loadingText="Fetching nearby blood requests..." />
      ) : (
        <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
          <div className="mb-8 flex justify-between">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Blood Requests</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Matching Request Results */}
          <div className=" p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {matchedLog.length > 0 ? (
              matchedLog.map((req, index) => (
                <div
                  key={index}
                  className="border p-6 rounded-2xl shadow-xl border-red-200 text-gray-800 bg-white hover:shadow-2xl transition duration-200 mb-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-white font-bold text-lg rounded-full w-12 h-12 bg-blue-600 flex justify-center items-center shadow-md">
                        {req.fullName?.split(' ').map(name => name[0].toUpperCase()).join('') || '?'}
                      </div>
                      <div>
                        <h1 className="font-semibold text-xl">{req.fullName || 'Unknown Name'}</h1>
                        <p className="text-sm text-gray-500">{req.email}</p>
                         
                      </div>
                
                    </div>

                    <div>
                      <div className={`text-center font-medium px-1 lg:px-5 py-1 rounded-full text-base animate-pulse ${req.urgency === 'Critical' ? 'bg-red-500 text-white' :
                        req.urgency === 'High' ? 'bg-orange-400 text-white' :
                          req.urgency === 'Medium' ? 'bg-yellow-300 text-gray-800' :
                            'bg-green-200 text-green-900'
                        }`}>
                        {req.urgency}
                      </div>
                      {req.status === 'accepted' &&
                        (<div className="mt-3 font-medium px-3 lg:px-5 py-1 rounded-full text-base bg-green-200 text-green-900">
                          Accepted
                        </div>
                        )}
                    </div>

                  </div>

                  <div className="space-y-2 text-sm leading-relaxed">
                    <p className="text-gray-600 text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {req.distance} km away.
                        </p>
                    <p>
                      <span className="font-medium text-gray-700">Blood Type:</span>{' '}
                      <span className="font-bold text-red-600">{req.bloodType}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Location:</span>{' '}
                      {req.address}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Phone:</span>{' '}
                      <a href={`tel:${req.phone}`} className="text-blue-600 hover:underline">{req.phone}</a>
                    </p>

                    <p>
                      <span className="font-medium text-gray-700">Hospital:</span>{' '}
                      {req.hospital}
                    </p>

                    <div className='border border-gray-200 rounded-lg p-5'>
                      {req.description}
                    </div>
                  </div>

                  <div className="actions mt-4">
                    {req.status !== 'accepted' ? (
                      <div className="grid grid-cols-2 gap-2 font-bold">
                        <button onClick={() => handleStatusUpdate(req.id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                          Accept Request
                        </button>
                        <button onClick={() => handleStatusUpdate(req.id, 'declined')} className="bg-white border border-red-500 hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm">
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 font-bold">
                        <button className="bg-red-500  hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                          Start a Conversation
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No matching blood requests found.
              </p>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default Donate;
