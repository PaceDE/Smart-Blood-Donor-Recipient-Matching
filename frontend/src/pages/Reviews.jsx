import React, { useEffect, useState } from 'react'
import TopBar from '../component/TopBar'
import { useAuth } from '../component/AuthContext'
import Loading from '../component/Loading';
import { useLocation, Link } from 'react-router';

const Reviews = () => {
    const location = useLocation();

    const { user, isLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setreviewLoading] = useState(true);

    const [viewedUser, setViewedUser] = useState(null);
    const [error, setError] = useState(null);
    const viewedUserId = location.state?.userId;
    const isOwnProfile = location.pathname.includes("/home/review");

    const [activeTab, setActiveTab] = useState("received");
    const [reviewReceived, setReviewReceived] = useState([]);
    const [reviewGiven, setReviewGiven] = useState([]);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/getuserhistory/${viewedUserId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );
                if (!response.ok)
                    throw new Error("Faiiled to fetch user");
                const data = await response.json();
                setViewedUser(data)
            } catch (err) {
                setError(err.message || "Unknown error");

            } finally {
                setLoading(false);
            }

        }

        const fetchReviews = async (id) => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/getuserreviews/${id}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                );
                if (!response.ok)
                    throw new Error("Faiiled to fetch user reviews");
                const data = await response.json();
                setReviewReceived(data.reviewReceived)
                setReviewGiven(data.reviewGiven)
            } catch (err) {
                setError(err.message || "Unknown error");

            } finally {
                setreviewLoading(false);
            }

        }

        if (!isOwnProfile) {
            fetchUser()
            fetchReviews(viewedUserId)

        }

        else {
            setLoading(false);
            fetchReviews(user._id);
        }

    }, [viewedUserId])

    if (isLoading || loading || reviewLoading)
        return (<Loading loadingText="Fetching User data..." />)
    if (error)
        return (<p className='text-red-500'>Some error occured. Please reload and try again.</p>)



    return (
        <div className="flex flex-col">
            <TopBar heading={"BloodLink Donations Reviews"} text={isOwnProfile ? `Thank you ${user.fullName} for your donations.` : `Donation Review History of  ${viewedUser.fullName}`} />
            <main className="p-6">
                {!isOwnProfile &&(
                <div className='mb-2'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-700">
                        <div className="flex flex-col border border-gray-100 rounded-lg p-3 shadow-sm">
                            <span className="text-sm text-gray-500">Full Name</span>
                            <span className="text-base font-medium">{viewedUser.fullName}</span>
                        </div>

                        <div className="flex flex-col border border-gray-100 rounded-lg p-3 shadow-sm">
                            <span className="text-sm text-gray-500">Total Donations</span>
                            <span className="text-base font-medium">{viewedUser.total_donations ?? 0}</span>
                        </div>

                        <div className="flex flex-col border border-gray-100 rounded-lg p-3 shadow-sm">
                            <span className="text-sm text-gray-500">Last Donation</span>
                            <span className="text-base font-medium">
                                {viewedUser.last_donation_date
                                    ? new Date(viewedUser.last_donation_date).toLocaleDateString()
                                    : "Not donated yet"}
                            </span>
                        </div>
                        <div className="flex flex-col border border-gray-100 rounded-lg p-3 shadow-sm">
                            <span className="text-sm text-gray-500">Williness Level {"(1-5)"}</span>
                            <span className="text-base font-medium">{viewedUser.willingness_level}</span>
                        </div>
                    </div>
                </div>
                )}
                <div className="bg-white w-full rounded-lg border-gray-400 shadow-md">
                    <div className="bg-white border-b-[2px] border-gray-200 w-full h-14 rounded-t-lg flex gap-x-4 sm:gap-x-8 md:gap-x-14 items-center pl-6 text-gray-500 font-medium text-xs sm:text:sm md:text-md lg:text-lg">
                        <div onClick={() => setActiveTab("received")} className={`h-full flex justify-center items-center border-b-[2px] border-transparent hover:border-gray-400 ${activeTab === "received" ? "!border-red-500 text-red-600 font-semibold" : ""}`}><p>{isOwnProfile ? "Reviews Recived" : `Reviews Received By ${viewedUser.fullName}`}</p></div>
                        <div onClick={() => setActiveTab("given")} className={`h-full flex justify-center items-center border-b-[2px] border-transparent hover:border-gray-400 ${activeTab === "given" ? "!border-red-500 text-red-600 font-semibold" : ""}`}><p>{isOwnProfile ? "Reviews Given" : `Reviews Given By ${viewedUser.fullName}`}</p></div>
                    </div>
                    <div className="w-full p-10 bg-white" >
                        {activeTab === "received" && (
                            <div>
                                {reviewReceived.length > 0 ? (
                                    reviewReceived.map((rev, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-all"
                                        >
                                            <p className="text-sm text-gray-500 mb-1">
                                                Reviewed by&nbsp;
                                                <Link to="/home/history" state={{ userId: rev.recipient._id }}>
                                                    <span className="font-semibold group relative cursor-pointer">{rev.recipient.fullName}
                                                        <span className='opacity-0 bg-gray-700 text-white absolute -right-15 -bottom-5 group-hover:opacity-100'> Click to see history</span>
                                                    </span>
                                                </Link>
                                            </p>
                                            <p className="text-gray-700 italic mb-2">"{rev.review}"</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(rev.donatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No reviews received yet.</p>
                                )}
                            </div>
                        )}
                        {activeTab === "given" && (
                            <div>
                                {reviewGiven.length > 0 ? (
                                    reviewGiven.map((rev, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-all"
                                        >
                                            <p className="text-sm text-gray-500 mb-1">
                                                Reviewed to&nbsp;
                                                <Link to="/home/history" state={{ userId: rev.donor._id }}>
                                                    <span className="font-semibold group relative cursor-pointer">{rev.donor.fullName}
                                                        <span className='opacity-0 bg-gray-700 text-white absolute -right-15 -bottom-5 group-hover:opacity-100'> Click to see history</span>
                                                    </span>
                                                </Link>
                                            </p>
                                            <p className="text-gray-700 italic mb-2">"{rev.review}"</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(rev.donatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No reviews received yet.</p>
                                )}
                            </div>
                        )}

                    </div>



                </div>
            </main>
        </div>
    )
}

export default Reviews
