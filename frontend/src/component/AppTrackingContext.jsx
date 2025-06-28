// context/AppTrackingContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppTrackingContext = createContext();

export const AppTrackingProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrackingStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/appTrackingStats');
      if (!res.ok) throw new Error('Failed to fetch tracking data');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingStats();
  }, []);

  return (
    <AppTrackingContext.Provider value={{ stats, loading, error }}>
      {children}
    </AppTrackingContext.Provider>
  );
};

export const useAppTracking = () => useContext(AppTrackingContext);
