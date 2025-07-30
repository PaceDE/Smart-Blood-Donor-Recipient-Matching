import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import LocationPicker from './LocationPicker';
import { toast } from 'react-toastify';


const RequestForm = () => {
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const urgencyLevels = ["Low", "High", "Critical"];

    const [errors, setErrors] = useState({});
    const [coordinates, setCoordinates] = useState({
        lat: 27.708317,
        lng: 85.320582,
        address: 'Kathmandu Metropolitan City, Kathmandu, Bagamati Province, Nepal',
    });

    const [formData, setFormData] = useState({
        bloodType: '',
        urgency: 'High',
        description: '',
        hospital: '',
        searchDistance: '',
        address: '',
        latitude: null,
        longitude: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bloodType) newErrors.bloodType = "Please select a blood type.";
        if (!formData.urgency) newErrors.urgency = "Please select urgency level.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (!formData.hospital.trim()) newErrors.hospital = "Hospital name is required.";
        if (!formData.searchDistance) newErrors.searchDistance = "Please provide search distance.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (id) => {
        if (!validateForm())
            return

        const requestInfo = {
            ...formData,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            address: coordinates.address,
        };

        try {
            const res = await fetch(`http://localhost:5000/api/request/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", 
                body: JSON.stringify({ requestInfo }),
            });
            const data = await res.json()


            if (!res.ok) {
                throw new Error(data.message || "Request failed.");
            }

            toast.success("Blood request submitted successfully!");
            setTimeout(() => { window.location.reload() }, 1500);

        } catch (err) {
            console.error("Submit error:", err);
            toast.error(err.message || "Failed to submit request.");
        }

    }

    return (
        <div className='px-10'>
            <div className='rounded-lg mt-6 border border-gray-200 shadow-md'>
                <div className="bg-white text-black w-full p-5 px-7 rounded-t-lg border-b border-gray-200">
                    <div className="flex items-center gap-x-5">
                        <FontAwesomeIcon icon={faHeart} className="text-red-500 text-2xl" />
                        <h3 className="text-[25px] font-medium">Blood request</h3>
                    </div>
                    <p>Fill out the form below to request blood from donors in your area</p>
                </div>

                <div className="w-full p-10 bg-white">
                    <form className="space-y-6">

                        {/* Blood Type Selection */}
                        <div className="form-element">
                            <label className="text-gray-700 font-medium mb-2 block">
                                Blood Type Required *
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {bloodTypes.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        name="bloodType"
                                        value={type}
                                        onClick={(e) => handleChange(e)}
                                        className={`border rounded-md p-2 transition-all duration-150 ${formData.bloodType === type
                                            ? 'bg-red-500 text-white border-red-500'
                                            : 'border-gray-200 hover:bg-red-50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Urgency */}
                        <div className="form-element">
                            <label className="text-gray-700 font-medium mb-2 block">Urgency *</label>
                            <select
                                name="urgency"
                                value={formData.urgency}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                {urgencyLevels.map((urgency) => (
                                    <option key={urgency} value={urgency}>{urgency}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="form-element">
                            <label className="text-gray-700 font-medium mb-2 block">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                rows="4"
                                placeholder="Provide additional information or reason for request..."
                            />
                        </div>

                        {/* Hospital */}
                        <div className="form-element">
                            <label className="text-gray-700 font-medium mb-2 block">Hospital Name</label>
                            <input
                                type="text"
                                name="hospital"
                                value={formData.hospital}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="e.g. Bir Hospital"
                            />
                        </div>

                        {/* Distance */}
                        <div className="form-element">
                            <label className="text-gray-700 font-medium mb-2 block">Search Distance (in km)</label>
                            <input
                                type="number"
                                name="searchDistance"
                                value={formData.searchDistance}
                                onChange={handleChange}
                                min="1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="e.g. 10"
                            />
                        </div>

                        <div>
                            <div>
                                <LocationPicker coordinates={coordinates} setCoordinates={setCoordinates} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-200"
                                onClick={() => handleSubmit(1)}
                            >
                                Find Nearby *Willing* Donors
                            </button>

                            {/* Button for all eligible donors */}
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition duration-200"
                                onClick={() => handleSubmit(0)}
                            >
                                Find *All* Nearby Donors
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestForm;
