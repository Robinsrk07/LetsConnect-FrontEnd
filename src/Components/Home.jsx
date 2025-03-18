import { useState } from "react";
import backgroundImage from "../assets/marek-piwnicki-fCKhY3Hi-1o-unsplash.jpg";
import { validateConfirmPassword, validatePassword, validateEmailId } from "../Components/utils/formValidation";
import axios from "axios";
import { addUser } from "./utils/userSlice";
import { useNavigate, useOutletContext } from "react-router";
import { useDispatch } from "react-redux";
const BASE_URL = import.meta.env.VITE_API_URL_AUTH_SERVICE;
const Home = () => {

const { isModalLogin, handleCloseModal } = useOutletContext()

  const [pincode, setPincode] = useState("");
  const [town, setTown] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
     const dispatch = useDispatch()
     const navigate = useNavigate();



  // Error state object
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    pincode: "",
    sendOtp: "",
    verifyOtp: "",
    LoginError:""
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "ROBINs@123",
    confirmPassword: "ROBINs@123",
    pincode: "",
    town: "",
    dob: null,
    about: "",
    gender: "",
  });
  const[loginCred , setLoginCred]= useState({
    emailId:"robincyriak07@gmail.com",
    password:"ROBINs@123"

  })

  console.log(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation logic
    let errorMessage = "";
    if (name === "email" && !validateEmailId(value)) {
        console.log("yes");
        
      errorMessage = "Invalid email address";
    }
    if (name === "password" && !validatePassword(value)) {
      errorMessage = "Invalid Password";
    }
    if (name === "confirmPassword" && !validateConfirmPassword(user.password, value)) {
      errorMessage = "Passwords do not match";
    }

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    // Update error state
    setError((prevError) => ({
      ...prevError,
      [name]: errorMessage,
    }));
  };

  const handleLoginInput = (e)=>{
    const{name,value}= e.target
    setLoginCred((prev)=>({
        ...prev,
        [name]:value
    }))

  }

 

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setUploadedFiles(files); // Store files in state
    console.log(files);
  }


  
  const fetchTownFromPincode = async (pincode) => {
    if (pincode.length !== 6) return; // Ensure pincode is 6 digits
    try {
      const response = await fetch(`http://api.zippopotam.us/in/${pincode}`);
      console.log("API Response:", response);

      if (!response.ok) throw new Error("Invalid pincode");

      const data = await response.json();
      console.log("API Data:", data);

      const townName = data.places[0]["place name"];
      setTown(townName); // Update the `town` state
      setUser((prevUser) => ({
        ...prevUser,
        town: townName, // Update the `town` field in the `user` state
        pincode: pincode,
      }));
      setError((prevError) => ({
        ...prevError,
        pincode: "",
      }));
    } catch (err) {
      console.error("Error fetching town:", err);
      setError((prevError) => ({
        ...prevError,
        pincode: "Invalid pincode ",
      }));
      setTown("");
    }
  };




  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setPincode(value);
    if (value.length === 6) {
      fetchTownFromPincode(value);
    } else {
      setTown("");
      setError((prevError) => ({
        ...prevError,
        pincode: "",
      }));
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/send-otp`, { email: user.email }, { withCredentials: true });
      if (res.status === 200) {
        setSendOtp(true);
        setError((prevError) => ({
          ...prevError,
          sendOtp: "",
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          sendOtp: "Failed to send OTP",
        }));
      }
    } catch (error) {
      console.error("Error while sending OTP:", error.message);
      setError((prevError) => ({
        ...prevError,
        sendOtp: "Failed to send OTP",
      }));
    }
  };




  const handleOtpVerify = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-otp`, { otp: otp, email: user.email }, { withCredentials: true });
      if (res.status === 200) {
        setError((prevError) => ({
          ...prevError,
          verifyOtp: "",
        }));
        setOtpVerified(true);
        document.getElementById("otp_success_modal").showModal(); // Show the success modal
      } else {
        setError((prevError) => ({
          ...prevError,
          verifyOtp: "OTP verification failed",
        }));
      }
    } catch (err) {
      console.error("OTP verification failed:", err.message);
      setError((prevError) => ({
        ...prevError,
        verifyOtp: "OTP verification failed",
      }));
    }
  };





  const handleSignUp = async () => {
    const formData = new FormData();
  
    // Append text fields
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('confirmPassword', user.confirmPassword);
    formData.append('pincode', user.pincode);
    formData.append('town', user.town);
    formData.append('dob', user.dob);
    formData.append('about', user.about);
    formData.append('gender', user.gender);
  
    // Append files from the uploadedFiles state
    uploadedFiles.forEach((file, index) => {
      formData.append('photos', file); // 'photos' should match the field name in Multer
    });
  
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
        withCredentials: true,
      });
      navigate("/login")
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };






  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        loginCred,
        { withCredentials: true }
      );
  
      // Dispatch the user data to Redux store
      dispatch(addUser(response.data));
  
      // Navigate to the profile page
      navigate("/profile", { replace: true });
    } catch (err) {
      // Handle errors
      setError((prevError) => ({
        ...prevError,
        LoginError: err.response?.data?.message || "Login failed. Please try again.",
      }));
    }
  };





  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
        <h1 className="text-6xl font-bold mb-4 text-center">Start Something Epic</h1>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn btn-primary btn-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={() => document.getElementById("my_modal_2").showModal()}
        >
          Sign Up
        </button>

        {/* Modal */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box bg-gradient-to-br from-slate-900 to-slate-800 text-white max-w-3xl rounded-lg shadow-2xl border border-gray-700">
            {/* Logo and Header */}
            <div className="flex flex-col items-center justify-center mb-8">
              {/* SVG Logo */}
              <div className="w-32 h-32 mb-4">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="90" fill="none" stroke="url(#logoGradient)" strokeWidth="6" />
                  <path d="M65,80 Q100,40 135,80" fill="none" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M65,120 Q100,160 135,120" fill="none" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M65,80 L65,120" fill="none" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M135,80 L135,120" fill="none" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-bold text-3xl mb-2 text-center bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">Let's Connect</h3>
              <p className="text-gray-300 text-center max-w-md">Join our community and start something amazing together</p>
            </div>

            {/* Form with improved styling */}
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={user.name}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                  {error.email && <p className="text-red-400 text-sm mt-1">{error.email}</p>}
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={user.password}
                    onChange={handleInputChange}
                  />
                  {error.password && <p className="text-red-400 text-sm mt-1">{error.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={user.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {error.confirmPassword && <p className="text-red-400 text-sm mt-1">{error.confirmPassword}</p>}
                </div>

                {/* Pincode Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Pincode</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter your pincode"
                    className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={pincode}
                    onChange={handlePincodeChange}
                    maxLength={6}
                  />
                  {error.pincode && <p className="text-red-400 text-sm mt-1">{error.pincode}</p>}
                </div>

                {/* Town/City Input (Auto-filled) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Town/City</span>
                  </label>
                  <input
                    type="text"
                    name="town"
                    placeholder="Town/City"
                    className="input bg-slate-800 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={user.town}
                    readOnly
                  />
                </div>

                {/* Gender */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Gender</span>
                  </label>
                  <select
                    name="gender"
                    className="select bg-slate-700 border-slate-600 w-full text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={user.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className="input bg-slate-700 border-slate-600 w-full text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={user.dob || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* About */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">About</span>
                </label>
                <textarea
                  name="about"
                  placeholder="Tell us about yourself"
                  className="textarea bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={user.about}
                  onChange={handleInputChange}
                />
              </div>

              {/* Photo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-300">Photo</span>
                </label>
                <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                  <input
                    type="file"
                    name="photos"
                    multiple // Allow multiple files
                    className="file-input file-input-bordered w-full bg-slate-800 text-white border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8">
                {sendOtp && (
                  <div className="form-control mb-8">
                    <label className="label">
                      <span className="label-text text-gray-300">Verify OTP</span>
                    </label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter your OTP"
                      className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    {error.verifyOtp && <p className="text-red-400 text-sm mt-1">{error.verifyOtp}</p>}
                  </div>
                )}

                <button
                  type="button"
                  className="btn bg-gradient-to-r from-blue-500 to-green-500 hover:brightness-110 w-full text-white font-bold py-3 rounded-lg transition-all duration-300 border-none"
                  onClick={sendOtp ? handleOtpVerify : handleSendOtp}
                >
                  {sendOtp ? "Verify OTP" : "Verify Email"}
                </button>
                {error.sendOtp && <p className="text-red-400 text-sm mt-1">{error.sendOtp}</p>}
              </div>
            </form>

            {/* Close button */}
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-circle btn-ghost absolute right-4 top-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
          {/* Modal backdrop */}
          <form method="dialog" className="modal-backdrop">
            <button>Close</button>
          </form>
        </dialog>

        {isModalLogin && (
          <dialog id="login_modal" className="modal" open>
            <div className="modal-box bg-gradient-to-br from-slate-900 to-slate-800 text-white max-w-3xl rounded-lg shadow-2xl border border-gray-700">
              <div className="flex flex-col items-center justify-center mb-8">
                <h3 className="font-bold text-3xl mb-2 text-center bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">Login</h3>
                <p className="text-gray-300 text-center max-w-md">Welcome back! Please log in to continue.</p>
              </div>

              {/* Login Form */}
              <form className="space-y-5">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Email</span>
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    placeholder="Enter your email"
                    value={loginCred.emailId}
                    onChange={handleLoginInput}
                    className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={loginCred.password}
                    onChange={handleLoginInput}
                    className="input bg-slate-700 border-slate-600 w-full text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="form-control mt-8">
                  <button
                    type="button"
                    className="btn bg-gradient-to-r from-blue-500 to-green-500 hover:brightness-110 w-full text-white font-bold py-3 rounded-lg transition-all duration-300 border-none"
                 onClick={handleLogin} >
                    Login
                  </button>{error.LoginError && (
                   <p className="text-red-400 text-sm mt-2 text-center">{error.LoginError}</p>)}
                  
                </div>
              </form>

              {/* Close Button */}
              <div className="modal-action">
                <button
                  className="btn btn-circle btn-ghost absolute right-4 top-4"
                  onClick={handleCloseModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </dialog>
        )}











        {/* OTP Verification Success Modal */}
        <dialog id="otp_success_modal" className="modal">
          <div className="modal-box bg-gradient-to-br from-slate-900 to-slate-800 text-white max-w-3xl rounded-lg shadow-2xl border border-gray-700">
            <div className="flex flex-col items-center justify-center mb-8">
              <h3 className="font-bold text-3xl mb-2 text-center bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">OTP Verified Successfully!</h3>
              <p className="text-gray-300 text-center max-w-md">Your email has been successfully verified. You can now proceed to login.</p>
            </div>
            <div className="modal-action">
              <button
                className="btn bg-gradient-to-r from-blue-500 to-green-500 hover:brightness-110 w-full text-white font-bold py-3 rounded-lg transition-all duration-300 border-none"
                onClick={handleSignUp}
              >

  Click to SignUp
             </button>
            </div>
          </div>
          {/* Modal backdrop */}
          <form method="dialog" className="modal-backdrop">
            <button>Close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};


export default Home;