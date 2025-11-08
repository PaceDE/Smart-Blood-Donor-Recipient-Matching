import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/bloodlink-logo.svg';
import { toast } from 'react-toastify';

const WILLINGNESS_CHOICES = [
  { value: 1, text: "1 - Not willing at all" },
  { value: 2, text: "2 - Somewhat willing" },
  { value: 3, text: "3 - Neutral" },
  { value: 4, text: "4 - Willing" },
  { value: 5, text: "5 - Very willing" },
];

export default function SecondStage() {
  const userInfo = JSON.parse(localStorage.getItem('registrationFormData'));
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [healthInfo, setHealthInfo] = useState({
    total_donations: '',
    last_donation_date: '',
    has_disease: false,
    recently_gave_birth: '',
    recent_piercing_or_tattoo: '',
    weight_kg: '',
    willingness_level: '5',
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setHealthInfo(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (healthInfo.total_donations!== '' && parseInt(healthInfo.total_donations) !== 0) {
      if(healthInfo.last_donation_date==='')
        newErrors.last_donation_date = "This field is required";
    }

    if (healthInfo.total_donations === '') newErrors.total_donations = "This field is required";
    if (healthInfo.total_donations < 0 ) newErrors.total_donations = "Total donation can''t be negative";
    if (healthInfo.weight_kg === '') newErrors.weight_kg = "Weight is required";
    if (healthInfo.weight_kg < 0) newErrors.weight_kg = "Weight can't be negative";
    if (!healthInfo.willingness_level) newErrors.willingness_level = "Willingness level is required";
    if (!agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitError('');
    setIsSubmitting(true);
    const healthData = { ...healthInfo };

    // If no donations, assign default placeholder dates
    if (parseInt(healthData.total_donations) === 0) {
      delete healthData.last_donation_date;
    }

    const userData = { userInfo, healthInfo: healthData };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success("Registration Succesfull");
        localStorage.clear();

        navigate('/login');
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'Registration failed');
      }
    } catch (error) {
      toast.error("Failed to register. Please try again.");

      setSubmitError(error.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container bg-red-50 min-w-full h-full p-5">
      <div className="logo-text flex flex-col justify-center items-center min-w-full gap-y-0">
        <h1 className="text-black text-3xl font-bold text-center">
          Smart Blood Donor Recipient Matching System
        </h1>
        <div className="w-[25%]">
          <img src={logo} className="w-full h-full object-contain" alt="Logo" />
        </div>
        <p className="text-gray-700 text-center max-w-xl">
          Join our community of life-savers. Register today to donate blood or find compatible donors in your area.
        </p>
      </div>

      <div className="px-10">
        <div className="rounded-lg mt-6 border border-gray-200 shadow-md">
          <div className="bg-red-500 text-white w-full p-5 px-7 rounded-t-lg">
            <h2 className="text-[25px] font-medium">Step 2: Health and Donation Information</h2>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label htmlFor="total_donations" className="block mb-1 font-medium">Total Donations *</label>
                <input
                  id="total_donations"
                  type="number"
                  value={healthInfo.total_donations}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.total_donations && <p className="text-red-500 text-sm">{errors.total_donations}</p>}
              </div>

              <div>
                <label htmlFor="last_donation_date" className="block mb-1 font-medium">Last Donation Date</label>
                <input
                  id="last_donation_date"
                  type="date"
                  value={healthInfo.last_donation_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.last_donation_date && <p className="text-red-500 text-sm">{errors.last_donation_date}</p>}
              </div>

              <div>
                <label htmlFor="has_disease" className="block mb-1 font-medium">Has Any Disease</label>
                <input
                  id="has_disease"
                  type="checkbox"
                  checked={healthInfo.has_disease}
                  onChange={handleChange}
                  className="scale-150 mt-2"
                />
              </div>

              {userInfo?.gender == "Female" && <div>
                <label htmlFor="recently_gave_birth" className="block mb-1 font-medium">Recently Gave Birth (Last 9 months)</label>
                <input
                  id="recently_gave_birth"
                  type="date"
                  value={healthInfo.recently_gave_birth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>}

              <div>
                <label htmlFor="recent_piercing_or_tattoo" className="block mb-1 font-medium">Recent Piercing or Tattoo (Last 6 months)</label>
                <input
                  id="recent_piercing_or_tattoo"
                  type="date"
                  value={healthInfo.recent_piercing_or_tattoo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </div>

              <div>
                <label htmlFor="weight_kg" className="block mb-1 font-medium">Weight (kg) *</label>
                <input
                  id="weight_kg"
                  type="number"
                  value={healthInfo.weight_kg}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.weight_kg && <p className="text-red-500 text-sm">{errors.weight_kg}</p>}
              </div>

              <div>
                <label htmlFor="willingness_level" className="block mb-1 font-medium">Willingness Level (1 - 5) *</label>
                <select
                  id="willingness_level"
                  value={healthInfo.willingness_level}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {WILLINGNESS_CHOICES.map(choice => (
                    <option key={choice.value} value={choice.value}>{choice.text}</option>
                  ))}
                </select>
                {errors.willingness_level && <p className="text-red-500 text-sm">{errors.willingness_level}</p>}
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="agreeToTerms">
                I agree to the <a href="#" className="text-red-600 underline">Terms and Conditions</a> and <a href="#" className="text-red-600 underline">Privacy Policy</a>. I understand that my information will be used to match me with compatible blood donors or recipients.
              </label>
              {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full p-3 text-white rounded-xl ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'
                  }`}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              {submitError && <p className="text-red-600 mt-3">{submitError}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
