import React, { useEffect, useState } from "react";
import Loading from "../../component/Loading";
import TopBar from "../../component/TopBar";
import { toast } from "react-toastify";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EventData = () => {
    const [eventDatas, setEventDatas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchEventDatas = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/getallEventData",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setEventDatas(data);
            } catch (err) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDatas();
    }, []);


    const handleExport = async (ip) => {
        ip === 1 ? setIsProcessing(true) : setIsSubmitting(true);

        try {
            const response = await fetch(
                `http://localhost:5000/api/exportCSV/${ip}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data=await response.json();
            if (!response.ok) throw new Error("Failed to export");
            toast.success(data.message || "");
        } catch (err) {
            setError(err.message || "Unknown error");
            toast.error("Failed to export. Please Try again.")
        } finally {
             ip===1? setIsProcessing(false):setIsSubmitting(false);
        }
    };

     const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/deleteeventdata",
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to delete");
            toast.success("Succesfuly deleted")
            setTimeout(()=>{
                window.location.reload();
            },2000)
        } catch (err) {
            setError(err.message || "Unknown error");
            toast.error("Failed to relete. Please Try again.")
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <Loading loadingText="Please wait fetching requests..." />
    }
    if (error) {
        return <p className="p-4 mt-14 text-red-500">Error: {error}</p>;
    }

    if (!eventDatas) {
        return <p className="p-4 text-gray-600">No user interaction found</p>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <TopBar
                heading="BloodLink Match Log Management"
                text="Welcome back to the match log management page"
            />

            <main className="flex-1 p-6">
                <div className="flex gap-4 sm:gap-6 md:gap-8 my-4">
                    <button disabled={isProcessing} onClick={() => handleExport(1)} type="button" className={`border-2 border-green-500 rounded md p-4 py-2 font-semibold hover:bg-green-500 hover:text-white cursor-pointer ${isProcessing ? "bg-green-500 text-white" : ""}`}>
                        Export to csv &nbsp;{isProcessing ? (<FontAwesomeIcon spin icon={faSpinner}></FontAwesomeIcon>) : (<></>)}
                    </button>
                    <button onClick={() => handleExport(2)} type="button" className={`border-2 border-green-500 rounded md p-4 py-2 font-semibold hover:bg-green-500 hover:text-white cursor-pointer ${isSubmitting ? "bg-green-500 text-white" : ""}`}>
                        Export to existing csv &nbsp;{isSubmitting ? (<FontAwesomeIcon spin icon={faSpinner}></FontAwesomeIcon>) : (<></>)}
                    </button>
                    <button type="button" onClick={handleDelete} className={`border-2 border-red-500 rounded md p-4 py-2 font-semibold hover:bg-red-500 hover:text-white cursor-pointer ${isDeleting ? "bg-red-500 text-white" : ""}`}>
                        Delete all data &nbsp;{isDeleting ? (<FontAwesomeIcon spin icon={faSpinner}></FontAwesomeIcon>) : (<></>)}
                    </button>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                    <table className="min-w-full text-sm text-left text-gray-700">
                        <thead className="bg-red-500 text-white">
                            <tr>
                                <th className="px-4 py-3">SN</th>
                                <th className="px-4 py-3">User Action</th>
                                <th className="px-4 py-3">Total Donations</th>
                                <th className="px-4 py-3">Recency {"(days)"}</th>
                                <th className="px-4 py-3">Blood Type</th>
                                <th className="px-4 py-3">Gender</th>
                                <th className="px-4 py-3">Urgency</th>
                                <th className="px-4 py-3">Distance</th>
                                <th className="px-4 py-3">Willingness_level</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {eventDatas.map((e, index) => (
                                <tr
                                    key={index}
                                    className="border-t hover:bg-red-50 transition"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2 relative">
                                        {e.event ? "Accepted" : "Declined"}
                                    </td>
                                    <td className="px-4 py-2 relative">
                                        {e.total_donations}
                                    </td>
                                    <td className="px-4 py-2">{`${e.recency} days`}</td>
                                    <td className="px-4 py-2">{e.bloodType}</td>
                                    <td className="px-4 py-2">
                                        {e.gender}
                                    </td>
                                    <td className="px-4 py-2">{e.urgency}</td>
                                    <td className="p-5">
                                        {`${e.distance} km`}
                                    </td>
                                    <td className="p-5 ">
                                        {e.willingness_level}
                                    </td>
                                </tr>
                            ))}
                            {eventDatas.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-4 text-gray-500 bg-gray-50"
                                    >
                                        No user's interactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
};

export default EventData;
