import React from 'react'
import { useAuth } from '../component/AuthContext';

export default function Home() {
  const{user,isLoading} =useAuth()
  if(isLoading)
    return <p>Loading...</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-red-600">Home Page</h1>
      <p>{user.fullName}</p>
    </div>
  );
}

