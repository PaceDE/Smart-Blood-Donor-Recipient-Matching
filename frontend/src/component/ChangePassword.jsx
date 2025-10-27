import React, { useState, useEffect } from 'react'
import logo from '../assets/bloodlink-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import Loading from './Loading';

const ChangePassword = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [edit, setEdit] = useState(false);

    if (!user) {
        return (<Loading loadingText="Please wait while we fetch data..." />)
    }

    const handleSave = async () => {
        if (!validateForm())
            return;

        setIsSubmitting(true);
        // since setFormdata is asynchronous so old formdata is saved so we use local var
        const updatedForm = { password,oldPassword};

        try {
            const response = await fetch("http://localhost:5000/api/changePassword", {
                method: 'PUT',
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedForm),
            });
           
            const data = await response.json();
             if (!response.ok) {
                throw new Error(data.message);
            }

            toast.success(data.message);
            setTimeout(()=>{
                window.location.reload();
            },1500);

        } catch (error) {
            console.error('Error changing message:', error);
            toast.error(error.message);
        }
        finally {
            setIsSubmitting(false);
            setEdit(false);

        }




    };

    const validateForm = () => {
        const newErrors = {};

        if (oldPassword === '')
            newErrors.oldPassword = "This field is required";
        if (password === '')
            newErrors.password = "This field is required";
        if (password.length < 8)
            newErrors.password = "The length of password should be at least 8 characters";
        if (confirmPassword === '')
            newErrors.confirmPassword = "This field is required";
        if (password !== confirmPassword)
            newErrors.confirmPassword = "It doesn't match with the above password";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="w-full bg-white">

            <form className="space-y-6">
                <div className="grid grid-cols-1 gap-y-3">

                    <div className="form-element">
                        <label htmlFor="oldPassword" className="text-gray-700 font-medium">
                            Old Password *
                        </label>

                        <div className='input-box relative'>

                            <input
                                id="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400"
                                onClick={() => setShowOldPassword(!showOldPassword)}

                            >
                                {showOldPassword ? (<FontAwesomeIcon icon={faEye} className='h-4 w-4 text-red-500' />) :
                                    (<FontAwesomeIcon icon={faEyeSlash} className='h-4 w-4 text-red-500' />)}

                            </button>
                        </div>
                        {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="password" className="text-gray-700 font-medium">
                            Password *
                        </label>

                        <div className='input-box relative'>

                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}

                            >
                                {showPassword ? (<FontAwesomeIcon icon={faEye} className='h-4 w-4 text-red-500' />) :
                                    (<FontAwesomeIcon icon={faEyeSlash} className='h-4 w-4 text-red-500' />)}

                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="confirm-password" className="text-gray-700 font-medium">
                            Confirm Password *
                        </label>
                        <div className='input-box relative'>
                            <input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-400"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}

                            >
                                {showConfirmPassword ? (<FontAwesomeIcon icon={faEye} className='h-4 w-4 text-red-500' />) :
                                    (<FontAwesomeIcon icon={faEyeSlash} className='h-4 w-4 text-red-500' />)}

                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>
                    <div className='form-element'>
                        <button type="button" onClick={handleSave}className='rounded-lg px-4 py-3 bg-red-500 text-white hover:bg-gradient-to-l from-red-500 to-red-700' disabled={isSubmitting}>{!isSubmitting ? "Save Changes" : "Saving"}</button>
                    </div>

                </div>

            </form >
        </div>
    )
}

export default ChangePassword;
