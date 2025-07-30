import React, { useState,useEffect } from 'react'
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
import LocationPicker from '../component/LocationPicker';
import SuccessToast from './SuccessToast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import Loading from './Loading';


const PersonalInfo = () => {
    const { user,setUser } = useAuth();
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [edit, setEdit] = useState(false);

    
    const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
    address: '',
  });

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    bloodType: '',
    email: '',
    phone: '',
    latitude: '',
    longitude: '',
    address: '',
    gender: ''
  });


  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        dateOfBirth: formatDate(user.dateOfBirth),
        bloodType: user.bloodType || '',
        email: user.email || '',
        phone: user.phone || '',
        latitude: user.latitude || '',
        longitude: user.longitude || '',
        address: user.address || '',
        gender: user.gender || ''
      });

      setCoordinates({
        lat: user.latitude,
        lng: user.longitude,
        address: user.address
      });
    }
  }, [user]);

  
  if (!user) {
    return( <Loading loadingText="Please wait while we fetch data..." />)
  }

    const handleCancel = (e) => {
        setFormData({
            fullName: user.fullName,
            dateOfBirth: formatDate(user.dateOfBirth),
            bloodType: user.bloodType,
            email: user.email,
            phone: user.phone,
            latitude: user.latitude,
            longitude: user.longitude,
            address: user.address,
            gender: user.gender
        })

        setEdit(false);
    }


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        if (!validateForm())
            return;

        // since setFormdata is asynchronous so old formdata is saved so we use local var
        const updatedForm = {
            ...formData,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            address: coordinates.address,
        };

        try {
            const response = await fetch("http://localhost:5000/api/updatePersonalInfo", {
                method: 'PUT',
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedForm),
            });
            if (!response.ok) {
                throw new Error('Failed to update user info');
            }
            const data = await response.json();
            setUser(data.user);

            toast.success("User's Personal Info updated successfully!");

            navigate('/home/profile');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error("Failed to save changes. Please try again.");
        }




    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.bloodType) newErrors.bloodType = "Blood type is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };





    return (
        <div className="w-full bg-white">

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-3">

                    <div className="form-element">
                        <label htmlFor="fullName" className="text-gray-700 font-medium">
                            Full Name *
                        </label>
                        <div className="relative mt-2">
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
                                readOnly={!edit}
                            />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="dateOfBirth" className="text-gray-700 font-medium ">
                            Date of Birth *
                        </label>
                        <div className="relative mt-2">
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
                                readOnly={!edit}
                            />
                        </div>
                        {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="gender" className="text-gray-700 font-medium ">
                            Gender *
                        </label>
                        <div className="relative mt-2">
                            <FontAwesomeIcon
                                icon={faDroplet}
                                className="absolute left-3 top-4 text-gray-400"
                            />
                            <select
                                id="gender"
                                className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={!edit}
                            >
                                <option value="Male">Male </option>
                                <option value="Female">Female </option>
                                <option value="Others">Others </option>

                            </select>
                        </div>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>

                    <div className="form-element">
                        <label htmlFor="bloodType" className="text-gray-700 font-medium ">
                            Blood Type *
                        </label>
                        <div className="relative mt-2">
                            <FontAwesomeIcon
                                icon={faDroplet}
                                className="absolute left-3 top-4 text-gray-400"
                            />
                            <select
                                id="bloodType"
                                className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                value={formData.bloodType}
                                onChange={handleChange}
                                disabled={!edit}
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
                        <label htmlFor="email" className="text-gray-700 font-medium ">
                            Email Address *
                        </label>
                        <div className="relative mt-2">
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
                                readOnly={!edit}

                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="form-element">
                        <label htmlFor="phone" className="text-gray-700 font-medium ">
                            Phone Number *
                        </label>
                        <div className="relative mt-2">
                            <FontAwesomeIcon
                                icon={faPhone}
                                className="absolute left-3 top-4 text-gray-400"
                            />
                            <input
                                id="phone"
                                type="tel"
                                placeholder="Enter your phone number"
                                className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                value={formData.phone}
                                onChange={handleChange}
                                readOnly={!edit}

                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>


                </div>
                {edit === false ?
                    (<div className="form-element">
                        <label className="text-gray-700 font-medium ">
                            Address *
                        </label>
                        <div className="relative mt-2">
                            <FontAwesomeIcon
                                icon={faLocation}
                                className="absolute left-3 top-4 text-gray-400"
                            />
                            <input
                                type="text"
                                className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                                value={formData.address}
                                readOnly
                            />
                        </div>

                    </div>) :
                    (<div className='border-b pb-5 border-gray-300'>
                        <LocationPicker coordinates={coordinates} setCoordinates={setCoordinates} />
                    </div>)}



                <div >

                    {edit === false ?
                        (<div onClick={() => { setEdit(true) }} className='text-center border border-red-500 text-red-500 bg-white  p-2 px-5 rounded-lg hover:bg-red-50 hover:text-black'>
                            <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="mr-2"
                            />
                            <button type="button"  className=''>Edit Information</button>
                        </div>) :
                        (<div className='flex flex-row-reverse gap-5'>

                            <div onClick={handleSave} className='text-center text-white bg-red-500  p-2 px-5 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'>
                                <FontAwesomeIcon
                                    icon={faFloppyDisk}
                                    className="mr-2"
                                />
                                <button type="button" className=''>Save Changes</button>
                            </div>

                            <div onClick={handleCancel} className='bg-white text-black border border-gray-300 rounded-lg p-2 px-5 hover:bg-gray-50'>
                                <button type="button"  className=''>Cancel</button>

                            </div>


                        </div>)}

                </div>

            </form>

        </div>
    )
}

export default PersonalInfo;
