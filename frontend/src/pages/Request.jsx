import React, { useEffect, useState } from 'react';
import TopBar from '../component/TopBar';

const Request = () => {
  const [existingRequest, setExistingRequest] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ fixed typo

  useEffect(() => {
    const fetchUserRequest = async () => {
      try {
        const res = await fetch("/api/currentRequest", {
          method: "GET",
          credentials: "include", // ✅ important to send cookies
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
        <div>Request Exists</div>
      ) : (
        <div>Request Form</div>
      )}
      </main>
  </div>
  );
};

export default Request;
