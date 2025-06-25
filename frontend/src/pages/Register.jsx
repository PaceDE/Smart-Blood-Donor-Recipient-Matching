import React, { useState } from 'react'
import logo from '../assets/bloodlink-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faDroplet,
    faPhone,
    faLock,
    faUserLock

} from '@fortawesome/free-solid-svg-icons';
import { faUser as faName, faCalendar, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import LocationPicker from '../component/LocationPicker';
import { useNavigate } from 'react-router-dom';




export default function Register() {
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [coordinates, setCoordinates] = useState({
        lat: 27.708317,
        lng: 85.320582,
        address: 'Kathmandu Metropolitan City, Kathmandu, Bagamati Province, Nepal',
    });
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        bloodType: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        latitude: null,
        longitude: null,
        address: '',
        gender: 'Male'
    });


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNext = () => {
        if (!validateForm())
            return;

        // since setFormdata is asynchronous so old formdata is saved so we use local var
        const updatedForm = {
            ...formData,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            address: coordinates.address,
        };
        const { confirmPassword, ...savedData } = updatedForm;

        localStorage.setItem('registrationFormData', JSON.stringify(savedData));
        navigate('/next-step'); // Assuming you're using react-router-dom
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.bloodType) newErrors.bloodType = "Blood type is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        /*if (!coordinates.address) {
            newErrors.address = "Please select your location on the map";
        }*/

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };




    return (
        <section className='container bg-red-50 min-w-full h-full p-5 '>
            <div className="logo-text flex flex-col justify-center items-center min-w-full gap-y-0">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent leading-tight">
                        Smart Blood Donor
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">Recipient Matching System</h2>
                </div>

                <div className="relative w-[25%]">
                    <img src={logo} className="w-full h-full object-contain" alt="Logo" />
                </div>
                <div className="max-w-2xl text-center">
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        Join our community of life-savers. Register today to donate blood or find compatible donors in your area.
                    </p>
                </div>

            </div>

            <div className='px-10'>
                <div className='rounded-lg mt-6 border border-gray-200 shadow-md'>
                    <div className="bg-red-500 text-white w-full p-5 px-7 rounded-t-lg">
                        <div className="flex items-center gap-x-5">
                            <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
                            <h3 className="text-[25px] font-medium">Create Your Account</h3>
                        </div>
                        <p>Fill in your details to get started with blood donation matching</p>
                    </div>
                    <div className="w-full p-10 bg-white">

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">

                                <div className="form-element">
                                    <label htmlFor="fullName" className="text-gray-700 font-medium mb-2 block">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faName}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />
                                        <input
                                            id="fullName"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                                </div>

                                <div className="form-element">
                                    <label htmlFor="dateOfBirth" className="text-gray-700 font-medium mb-2 block">
                                        Date of Birth *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faCalendar}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />

                                        <input
                                            id="dateOfBirth"
                                            type="date"
                                            className="pl-10 pr-5 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                                </div>

                                <div className="form-element">
                                    <label htmlFor="gender" className="text-gray-700 font-medium mb-2 block">
                                        Gender *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faDroplet}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />
                                        <select
                                            id="gender"
                                            className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Gender</option>

                                            <option value="Male">Male </option>
                                            <option value="Female">Female </option>
                                            <option value="Others">Others </option>

                                        </select>
                                    </div>
                                    {errors.bloodType && <p className="text-red-500 text-sm">{errors.bloodType}</p>}
                                </div>

                                <div className="form-element">
                                    <label htmlFor="bloodType" className="text-gray-700 font-medium mb-2 block">
                                        Blood Type *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faDroplet}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />
                                        <select
                                            id="bloodType"
                                            className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.bloodType}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Blood Type</option>
                                            {bloodTypes.map((type, index) => (
                                                <option key={index} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.bloodType && <p className="text-red-500 text-sm">{errors.bloodType}</p>}
                                </div>

                                <div className="form-element">
                                    <label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faEnvelope}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your Email address"
                                            className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.email}
                                            onChange={handleChange}

                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>

                                {/* Phone Number */}
                                <div className="form-element">
                                    <label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faPhone}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}

                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                                </div>

                                {/* Password */}
                                <div className="form-element">
                                    <label htmlFor="password" className="text-gray-700 font-medium mb-2 block">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.password}
                                            onChange={handleChange}

                                        />
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className="form-element">
                                    <label htmlFor="confirmPassword" className="text-gray-700 font-medium mb-2 block">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faUserLock}
                                            className="absolute left-3 top-4 text-gray-400"
                                        />
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Re-enter your password"
                                            className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}


                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                                </div>

                            </div>
                            <div>
                                <LocationPicker coordinates={coordinates} setCoordinates={setCoordinates} />
                            </div>
                            {/*<div className="flex items-start space-x-2">
                                <input
                                   type="checkbox"
                                    id="agreeToTerms"
                                    className="mt-2 scale-150"
                                />
                                <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                                    I agree to the{" "}
                                    <a href="/" className="text-red-600 hover:text-red-700 underline">
                                        Terms and Conditions
                                    </a>{" "}
                                    and{" "}
                                    <a href="/" className="text-red-600 hover:text-red-700 underline">
                                        Privacy Policy
                                    </a>
                                    . I understand that my information will be used to match me with compatible blood donors or
                                    recipients.
                                </label>
                            </div>*/}
                            <div>
                                <button type="button" onClick={handleNext} className='text-center text-white bg-red-500 w-full p-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'>Next Step</button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </section>
    )
}
