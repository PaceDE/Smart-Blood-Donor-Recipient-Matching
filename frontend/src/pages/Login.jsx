import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/bloodlink-logo.svg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEye,
  faEyeSlash,
  faLock,

} from '@fortawesome/free-solid-svg-icons';
import {  faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from "../component/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loginError,setLoginError] =useState();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {login} =useAuth();

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!password) newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm())
      return

    setIsSubmitting(true)
     try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Login successful:", data);
        setIsSubmitting(false);
        
        login(data.user,data.healthInfo);
        if(data.user.role==="admin")
        {
          navigate("/admin");
          return;
        }
        navigate("/home");
      } else {
        setIsSubmitting(false);
        setLoginError(data.msg);
      }
    } catch (error) {
      setIsSubmitting(false);
      setLoginError("Error occured.");
      console.error("Login failed:", error.message);
    }
  }

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
          <img src={logo} className="w-full h-full" alt="Logo" />
        </div>
        <div className="max-w-2xl text-center">
          <p className="text-base text-gray-600">
            Sign in to your account to continue saving lives.
          </p>
        </div>

      </div>

      <div className='px-10'>
        <div className='rounded-lg mt-6 border border-gray-200 shadow-md'>
          <div className=" text-white w-full p-5 px-7 rounded-t-lg bg-gradient-to-r from-red-500 to-red-600">
            <div className="flex items-center gap-x-5">
              <FontAwesomeIcon icon={faUser} className="text-white text-2xl " />
              <h3 className="text-[25px] font-medium">Sign In</h3>
            </div>
            <p>Enter your credentials to access your account</p>
          </div>
          <div className="w-full p-10 bg-white">

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}

                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                      type={showPassword? "text":"password"}
                      placeholder="Enter your password"
                      className="pl-10 rounded-md w-full h-12 border border-gray-300 ring-offset-2 focus:outline-none focus:border-red-500 focus:ring-red-500 focus:ring-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}

                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (<FontAwesomeIcon icon={faEye} className='h-4 w-4 text-gray-400'/>) 
                      : (<FontAwesomeIcon icon={faEyeSlash}className='h-4 w-4 text-gray-400'/>)}
                     
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>



              </div>



              <div>
                <button type="submit" disabled={isSubmitting}onClick={handleSubmit} className='text-center text-white bg-red-500 w-full p-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'>
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              </div>

            </form>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
