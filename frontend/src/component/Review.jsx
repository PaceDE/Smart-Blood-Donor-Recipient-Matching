import React, { useState } from 'react'
import { XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Review = ({ openReview, setOpenReview, logId, donor, recipient, name }) => {
    const [review, setReview] = useState("");
    const handleSubmit = async () => {
        const donationData = {
            logId,
            donor,
            recipient,
            review,
        }
        try {

            const res = await fetch("http://localhost:5000/api/donationCompleted", {
                method: 'POST',
                credentials: 'include',
                body : JSON.stringify(donationData)
            });
            if (!res.ok) {
                throw new Error('Failed to cancel request');
            }
            toast.success('Request cancelled successfully!');
            setTimeout(() => { window.location.reload() }, 1500);
        }
        catch (err) {
            console.error(err);
            toast.error('Failed to update');

        }


    }
    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl">
                <div className='flex justify-between border-b border-gray-200 mb-5'>
                    <h2 className="font-semibold text-lg">Write a review</h2>
                    <XCircle
                        onClick={() => setOpenReview(false)}
                        className="text-gray-600 hover:text-gray-900"
                    />
                </div>
                <div className='bg-white'>
                    <textarea
                        rows="6"
                        placeholder={`Thank you ${name}`}
                        style={{ scrollbarWidth: 'none' }}
                        className="w-full text-black font-normal flex-1 border rounded-lg px-3 py-2 bg-gray-100 border-gray-300 resize-none focus:outline-red-500"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                    <br />
                    <button
                        disabled={review === ""}
                        onClick={handleSubmit}
                        className={`w-full text-white font-normal px-3 py-2 rounded-lg ${review === "" ? "bg-red-300" : "bg-red-500 hover:bg-red-600"}`}>
                        Submit
                    </button>
                </div>
            </div>

        </div>
    )
}
export default Review;