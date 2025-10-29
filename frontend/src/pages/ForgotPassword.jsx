import React, { useState } from 'react'
import logo from '../assets/bloodlink-logo.svg';
import Footer from '../component/Footer';
import { toast } from 'react-toastify';
import { Link } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faEnvelope } from '@fortawesome/free-regular-svg-icons';

const ForgotPassword = () => {

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        dateOfBirth: '',
    });

    const [submitted, setSubmitted] = useState(false);


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        if (!validateForm())
            return;

        setIsSubmitting(true)
        try {
            const response = await fetch('http://localhost:5000/api/forgotpassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data=await response.json()
            if (response.ok) {
                toast.success(data.message||"Your password has been reset successfully if the provided information is correct. Please Check your registered email.");
                setSubmitted(true);

            } else {
                toast.error(data.message || "Your password has been reset successfully if the provided information is correct. Please Check your registered email.")
            }
        } catch (error) {
            toast.error("Failed to submit.Please Try again");
        } finally {
            setIsSubmitting(false);
        }
    };


    const validateForm = () => {
        const newErrors = {};


        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";

        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    return (
        <section className='container bg-gray-50 min-w-full h-full p-5 '>
            <div className="logo-text flex flex-col justify-center items-center min-w-full gap-y-0">
                <div className="relative w-[25%]">
                    <img src={logo} className="w-full h-full object-contain" alt="Logo" />
                </div>
            </div>

            <div className='px-10'>
                <div className='rounded-lg mt-6 border border-gray-200 shadow-md'>
                    <div className="bg-red-500 text-white w-full p-5 px-7 rounded-t-lg">
                        {!submitted ? (
                            <p>Fill in your details to recover your account.</p>

                        ) : (
                            <p>Account Recovery</p>
                        )}
                    </div>

                    {!submitted ? (


                        <div className="w-full p-10 bg-white">

                            <form className="space-y-6">
                                <div>

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
                                                className="pl-10 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
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
                                                className="pl-10 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                                                value={formData.phone}
                                                onChange={handleChange}

                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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
                                                className="pl-10 pr-5 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                                    </div>

                                </div>

                                <div>
                                    <button type="button" disabled={isSubmitting} onClick={handleSubmit} className='text-center text-white bg-red-500 w-full p-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'>Submit</button>
                                </div>

                            </form>

                        </div>
                    ) : (
                        <div className='flex flex-col justify-center items-center'>
                            <div>
                                <p className='text-center mt-2 text-gray-600'>If the information provided by you was correct, the new password has been sent to your registered email.</p>
                                <p className='text-center mt-2 text-red-500'>Dont forget to Change you password after login for security reason.</p>

                            </div>
                            <Link  to="/login" className='text-center text-black underline'>
                               Proceed to login
                            </Link>


                        </div>
                    )};
                </div>
            </div>
            <Footer />
        </section>
    )
}

export default ForgotPassword