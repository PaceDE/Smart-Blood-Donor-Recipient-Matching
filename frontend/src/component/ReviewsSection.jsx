import React from 'react'
import { useAuth } from './AuthContext'

const ReviewsSection = () => {
    const {userid}=useAuth;
    return (
        <div className="bg-white w-full rounded-lg border-gray-400 shadow-md">
            <div className="bg-white border-b-[2px] border-gray-200 w-full h-14 rounded-t-lg flex gap-x-4 sm:gap-x-8 md:gap-x-14 items-center pl-6 text-gray-500 font-medium text-xs sm:text:sm md:text-md lg:text-lg">
                <div><p>Donation Review</p></div>
                <div><p>Review</p></div>

            </div>



        </div>
    )
}

export default ReviewsSection