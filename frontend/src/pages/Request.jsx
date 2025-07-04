import React, { useEffect, useState } from 'react';
import TopBar from '../component/TopBar';
import RequestForm from '../component/RequestForm';
import CurrentRequest from '../component/CurrentRequest';

const Request = () => {
  const [existingRequest, setExistingRequest] = useState(null);
  const [loading, setLoading] = useState(true); 
  const[matchedCount,setMatchedCount]=useState(0);

  useEffect(() => {
    const fetchUserRequest = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/currentRequest", {
          method: "GET",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("No request found");
        }

        const data = await res.json();
        setExistingRequest(data);
      } catch (err) {
        setExistingRequest(null); // ❌ no request exists or error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequest();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <TopBar heading={"Blood request"} text={`Connect with Blood Donor in your area.`} />
      <main className="flex-1 p-6">
      {existingRequest ? (
        <CurrentRequest existingRequest={existingRequest}/>
      ) : (
        <RequestForm />
      )}
      </main>
  </div>
  );
};

export default Request;
