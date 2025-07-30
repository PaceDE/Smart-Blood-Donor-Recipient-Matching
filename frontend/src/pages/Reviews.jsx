import React from 'react'
import TopBar from '../component/TopBar'
import { useAuth } from '../component/AuthContext'
import Loading from '../component/Loading';

const Reviews = () => {
    const {user,isLoading} =useAuth();
    if (isLoading)
        return( <Loading loadingText="Fetching User data..." />)
    return (
        <div className="flex flex-col">
            <TopBar heading={"BloodLink Donations Reviews"} text={`Thank you ${user.fullName} for your donations.`} />
            <main className="flex-1 p-6">
            </main>
        </div>
    )
}

export default Reviews
