import React, { useState, useEffect } from 'react'
import logo from '../assets/bloodlink-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faDroplet,
    faPhone,
    faLock,
    faUserLock,
    faPenToSquare,
    faLocation

} from '@fortawesome/free-solid-svg-icons';
import { faUser as faName, faCalendar, faEnvelope, faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import Loading from './Loading';

const WILLINGNESS_CHOICES = [
    { value: 1, text: "1 - Not willing at all" },
    { value: 2, text: "2 - Somewhat willing" },
    { value: 3, text: "3 - Neutral" },
    { value: 4, text: "4 - Willing" },
    { value: 5, text: "5 - Very willing" },
];

const HealthInfo = () => {
    const { healthInfo, setHealthInfo, user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [edit, setEdit] = useState(false);

    const [formData, setFormData] = useState({
        total_donations: '',
        last_donation_date: '',
        has_disease: '',
        recently_gave_birth: '',
        recent_piercing_or_tattoo: '',
        weight_kg: '',
        willingness_level: '',
    });


    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };


    useEffect(() => {
        if (healthInfo) {
            setFormData({
                total_donations: healthInfo.total_donations || '',
                last_donation_date: formatDate(healthInfo.last_donation_date),
                has_disease: healthInfo.has_disease || false,
                recently_gave_birth: formatDate(healthInfo.recently_gave_birth) || '',
                recent_piercing_or_tattoo: healthInfo.recent_piercing_or_tattoo || '',
                weight_kg: healthInfo.weight_kg || '',
                willingness_level: healthInfo.willingness_level || '',
            });
        }
    }, [healthInfo]);


    if (!healthInfo) {
        return (<Loading loadingText="Please wait while we fetch data..." />)
    }

    const handleCancel = (e) => {
        setFormData({
            total_donations: healthInfo.total_donations || '',
            last_donation_date: formatDate(healthInfo.last_donation_date),
            has_disease: healthInfo.has_disease || false,
            recently_gave_birth: formatDate(healthInfo.recently_gave_birth) || '',
            recent_piercing_or_tattoo: healthInfo.recent_piercing_or_tattoo || '',
            weight_kg: healthInfo.weight_kg || '',
            willingness_level: healthInfo.willingness_level || '',
        });

        setEdit(false);
    }


    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [id]: type === "checkbox" ? checked : value }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        if (!validateForm())
            return;

      
        const updatedForm = {
            ...formData,
            has_disease: Boolean(formData.has_disease),
            last_donation_date: parseInt(formData.total_donations) === 0 ? new Date("2000-01-01") : formData.last_donation_date
        };

        try {
            const response = await fetch("http://localhost:5000/api/updateHealthInfo", {
                method: 'PUT',
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedForm),
            });
            if (!response.ok) {
                throw new Error('Failed to update user health info');
            }
            const data = await response.json();
            setHealthInfo(data.healthInfo);

            toast.success("User's Health Info updated successfully!");

        } catch (error) {
            console.error('Error updating user:', error);
            toast.error("Failed to save changes. Please try again.");
        }
        finally {
            setIsSubmitting(false);
            setEdit(false);

        }




    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.total_donations !== '' && parseInt(formData.total_donations) !== 0) {
            if (formData.last_donation_date === '')
                newErrors.last_donation_date = "This field is required";
        }
        if (formData.total_donations === '')
            newErrors.total_donations = "This field is required";
        if (formData.total_donations < 0)
            newErrors.total_donations = "Total donation can''t be negative";
        if (formData.weight_kg === '')
            newErrors.weight_kg = "Weight is required";
        if (formData.weight_kg < 0) newErrors.weight_kg = "Weight can't be negative";
        if (!formData.willingness_level)
            newErrors.willingness_level = "Willingness level is required";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="w-full bg-white">

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">

                    <div className="form-element">
                        <label htmlFor="total_donations" className="text-gray-700 font-medium">
                            Total Donations *
                        </label>

                        <input
                            id="total_donations"
                            type="number"
                            placeholder="Enter your full name"
                            className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                            value={formData.total_donations}
                            onChange={handleChange}
                            readOnly={!edit}
                        />
                        {errors.total_donations && <p className="text-red-500 text-sm">{errors.total_donations}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="last_donation_date" className="text-gray-700 font-medium ">
                            Last Donation Date *
                        </label>

                        <input
                            id="last_donation_date"
                            type="date"
                            className="pl-4 pr-5 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                            value={formData.last_donation_date}
                            onChange={handleChange}
                            readOnly={!edit}
                        />

                        {errors.last_donation_date && <p className="text-red-500 text-sm">{errors.last_donation_date}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="has_disease" className="text-gray-700 font-medium ">
                            Has Disease *
                        </label><br></br>

                        <input
                            id="has_disease"
                            type="checkbox"
                            className="w-12 h-12"
                            checked={formData.has_disease}
                            onChange={handleChange}
                            disabled={!edit}
                        />

                        {errors.has_disease && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>

                    {user.gender == "Female" && (

                        <div className="form-element">
                            <label htmlFor="recently_gave_birth" className="text-gray-700 font-medium ">
                                Recently Gave birth *
                            </label>

                            <input
                                type="date"
                                id="recently_gave_birth"
                                className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                                value={formData.recently_gave_birth}
                                onChange={handleChange}
                                disabled={!edit}
                            />
                            {errors.recently_gave_birth && <p className="text-red-500 text-sm">{errors.bloodType}</p>}
                        </div>
                    )}

                    <div className="form-element">
                        <label htmlFor="recent_piercing_or_tattoo" className="text-gray-700 font-medium ">
                            Recent Piercing or Tattoo *
                        </label>
                        <input
                            id="recent_piercing_or_tattoo"
                            type="date"
                            className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                            value={formData.recent_piercing_or_tattoo}
                            onChange={handleChange}
                            readOnly={!edit}

                        />
                        {errors.recent_piercing_or_tattoo && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="weight_kg" className="text-gray-700 font-medium ">
                            Weight {"(Kg)"} *
                        </label>

                        <input
                            id="weight_kg"
                            type="number"
                            className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                            value={formData.weight_kg}
                            onChange={handleChange}
                            readOnly={!edit}

                        />

                        {errors.weight_kg && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="willingness_level" className="text-gray-700 font-medium">Willingness Level (1 - 5) *</label>
                        <select
                            id="willingness_level"
                            value={formData.willingness_level}
                            disabled={!edit}
                            onChange={handleChange}
                            className="pl-4 rounded-md w-full h-12 border-b-2 border-b-red-200 focus:outline-none focus:border-b-red-500 transition-colors duration-300 ease-linear"
                        >
                            {WILLINGNESS_CHOICES.map(choice => (
                                <option key={choice.value} value={choice.value}>{choice.text}</option>
                            ))}
                        </select>
                        {errors.willingness_level && <p className="text-red-500 text-sm">{errors.willingness_level}</p>}
                    </div>


                </div>

                {edit === false ?
                    (<div onClick={() => { setEdit(true) }} className='text-center border border-red-500 text-red-500 bg-white  p-2 px-5 rounded-lg hover:bg-red-50 hover:text-black'>
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="mr-2"
                        />
                        <button type="button" className=''>Edit Information</button>
                    </div>) :
                    (<div className='flex flex-row-reverse gap-5'>

                        <div onClick={handleSave} className='text-center text-white bg-red-500  p-2 px-5 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'>
                            <FontAwesomeIcon
                                icon={faFloppyDisk}
                                className="mr-2"
                            />
                            <button type="button" className='' disabled={isSubmitting}>{!isSubmitting ? "Save Changes" : "Saving"}</button>
                        </div>

                        <div onClick={handleCancel} className='bg-white text-black border border-gray-300 rounded-lg p-2 px-5 hover:bg-gray-50'>
                            <button type="button" className=''>Cancel</button>

                        </div>


                    </div>)}

            </form >
        </div>
    )
}

export default HealthInfo;
