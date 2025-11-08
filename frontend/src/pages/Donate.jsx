import React, { useState, useEffect } from 'react';
import TopBar from '../component/TopBar';
import Loading from '../component/Loading';
import { toast } from 'react-toastify';
import { MapPin, BadgeCheck, Heart } from 'lucide-react';
import { useAuth } from '../component/AuthContext';
import { checkEligibility } from './Home';
import Chat from '../component/Chat';
import { Link } from 'react-router';
import { useSocket } from '../component/SocketContext';


const Donate = () => {

  const [filterUrgency, setFilterUrgency] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const urgencyType = ["All", "Low", "High", "Critical"];
  const statusType = ["All", "Active", "Accepted"];

  const [matchedLog, setMatchedLog] = useState([]);
  const [filteredLog, setFilteredLog] = useState([])
  const [loading, setLoading] = useState(false);
  const { user, healthInfo, totalRequests, totalDonations, isLoading } = useAuth();
  const eligible = checkEligibility(user, healthInfo);
  const [chatOpen, setChatOpen] = useState(false);
  const { socket, messages, setMessages, messageLoading } = useSocket();


  useEffect(() => {
    const fetchMatchedLogs = async () => {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:5000/api/matchedLog', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch matched logs');
        }

        const data = await response.json();
        setMatchedLog(data);
        setFilteredLog(data)
      } catch (error) {
        console.error('Error fetching matched logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedLogs();
  }, []);


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
      setTimeout(() => window.location.reload(), 1500)
    }
  };

  useEffect(() => {
    let filtered = [...matchedLog];
    if (filterUrgency !== "All") {
      filtered = filtered.filter(
        (f) => f.urgency.toLowerCase() === filterUrgency.toLowerCase()
      )
    }
    if (filterStatus !== "All") {
      filtered = filtered.filter(
        f => f.status.toLowerCase() === filterStatus.toLowerCase())
    }
    setFilteredLog(filtered);

  }, [filterUrgency, filterStatus]);


  if (isLoading || messageLoading)
    return (<Loading loadingText="Fetching user..." />)


  return (
    <div className="flex flex-col">
      <TopBar
        heading={"Donate Now"}
        text={`As a donor, you can view and respond to nearby blood requests `}
      />

      <div className="mt-5 w-full mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className={`mb-8 bg-gradient-to-r from-green-50 to-green-100 border rounded-xl shadow-sm p-6 ${eligible ? "from-green-50 to-green-100 border-green-200" : "from-red-50 to-red-100 border-red-200"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Profile Info */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" fill="currentColor" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
                <p className="text-gray-600">
                  Blood Type:{' '}
                  <span className="font-semibold text-red-600">
                    {user.bloodType}
                  </span>
                </p>
              </div>
            </div>


            <div className={`flex items-center  text-white text-sm font-semibold px-3 py-1 rounded-full ${eligible ? "bg-green-500" : "bg-red-500"}`}>
              <BadgeCheck className="h-4 w-4 mr-1" />
              {eligible ? "Available to DOnate" : "Not Available to DOnate"}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading loadingText="Fetching nearby blood requests..." />
      ) : (
        <main className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
          <div className="mb-8 flex justify-between items-center flex-wrap">
            <div className=' flex gap-4 items-center w-full md:w-2/3'>
              <p className='bg-red-500 text-md font-semibold text-white p-1 px-5 rounded-full'>{filteredLog.length} Active</p>
              <h2 className="text-2xl font-bold text-gray-800">Blood Requests</h2>
            </div>
            <div className='w-full md:w-1/3'>
              <div className="flex flex-col md:flex-row-reverse gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {urgencyType.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}

                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {statusType.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}

                  </select>
                </div>


              </div>
            </div>
          </div>

          {/* Filters */}


          {/* Matching Request Results */}
          <div className=" p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredLog.length > 0 ? (
              filteredLog.map((req, index) => {

                
                const hasRead= messages.some(msg => req.userId === msg.sender && msg.status==="sent" )
                return (
                  <div
                    key={index}
                    className="border p-6 rounded-2xl shadow-xl border-red-200 text-gray-800 bg-white hover:shadow-2xl transition duration-200 mb-6"
                  >
                    <div className="flex items-center justify-between">
                      <Link to="/home/history" state={{ userId: req.userId }}>

                        <div className="flex items-center gap-4 mb-4 group relative cursor-pointer">
                          <div className="text-white font-bold text-lg rounded-full w-12 h-12 bg-blue-600 flex justify-center items-center shadow-md">
                            {req.fullName?.split(' ').map(name => name[0].toUpperCase()).join('') || '?'}
                          </div>
                          <div>
                            <h1 className="font-semibold text-xl">{req.fullName || 'Unknown Name'}</h1>
                            <p className="text-sm text-gray-500">{req.email}</p>

                          </div>
                          <span className='absolute -right-15 -bottom-6 bg-gray-700 text-white opacity-0 group-hover:opacity-100 hover:opacity-100'>
                            Click to see history
                          </span>

                        </div>
                      </Link>

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

                        {hasRead && (
                            <div className='mt-3 bg-red-500 text-white text-center font-medium px-1 lg:px-5 py-1 rounded-full text-base animate-pulse'>
                              Unread Message
                            </div>)}

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
                          <button onClick={() => { setChatOpen(true) }} className="bg-red-500  hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                            Start a Conversation
                          </button>
                          {chatOpen && <Chat chatOpen={chatOpen} setChatOpen={setChatOpen} sendFrom={user._id} sendTo={req.userId} name={req.fullName} requestId={req.requestId} />}
                        </div>
                      )}
                    </div>

                  </div>
                )
              })
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
