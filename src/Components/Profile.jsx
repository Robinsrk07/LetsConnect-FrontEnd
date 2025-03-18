import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./utils/userSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Fixed import
import { Heart, MessageCircle, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE;

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const fetchUser = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${BASE_URL}/userService/profile/view`, { 
        withCredentials: true 
      });
      dispatch(addUser(resp.data));
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePrevSlide = () => {
    if (user?.photoUrl?.length > 0) {
      setActiveSlide((prev) => (prev === 0 ? user.photoUrl.length - 1 : prev - 1));
    }
  };

  const handleNextSlide = () => {
    if (user?.photoUrl?.length > 0) {
      setActiveSlide((prev) => (prev === user.photoUrl.length - 1 ? 0 : prev + 1));
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Profile Not Found</h2>
          <p className="mt-2 text-gray-500">Unable to load your profile information.</p>
        </div>
        <button 
          onClick={fetchUser}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { name, emailId, photoUrl = [], about, dob, gender, town, pincode } = user;
  const age = calculateAge(dob);
  const hasPhotos = photoUrl && photoUrl.length > 0;

  return (
    <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
      {/* Photo Gallery */}
      <div className="relative h-[75vh] bg-gray-900">
        {hasPhotos ? (
          <>
            <img 
              src={photoUrl[activeSlide]} 
              alt={`${name}'s photo`} 
              className="w-full h-full object-cover"
            />
            
            {/* Photo navigation dots */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5">
              {photoUrl.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1 rounded-full ${activeSlide === index ? 'bg-white w-6' : 'bg-white/50 w-4'} transition-all`}
                  onClick={() => setActiveSlide(index)}
                ></div>
              ))}
            </div>
            
            {/* Navigation arrows */}
            {photoUrl.length > 1 && (
              <>
                <button 
                  onClick={handlePrevSlide}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNextSlide}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="text-center text-white p-6">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
              <p className="mb-4">Add photos to complete your profile</p>
              <Link 
                to="/editProfile"
                className="px-4 py-2 bg-white text-purple-700 rounded-full inline-flex items-center hover:bg-gray-100 transition"
              >
                <Edit size={16} className="mr-2" />
                Add Photos
              </Link>
            </div>
          </div>
        )}
        
        {/* Profile info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h1 className="text-3xl font-bold mb-1">
            {name} {age && <span className="ml-2">{age}</span>}
          </h1>
          {town && (
            <div className="mb-2 flex items-center text-gray-300">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {town} {pincode && `- ${pincode}`}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-around py-4 border-b">
        <Link to="/editProfile" className="flex flex-col items-center text-gray-700 hover:text-purple-600 transition">
          <div className="p-3 rounded-full bg-gray-100 hover:bg-purple-100 transition">
            <Edit size={20} />
          </div>
          <span className="text-xs mt-1">Edit</span>
        </Link>
        {/* <button className="flex flex-col items-center text-gray-700 hover:text-red-500 transition">
          <div className="p-3 rounded-full bg-gray-100 hover:bg-red-50 transition">
            <Heart size={20} />
          </div>
          <span className="text-xs mt-1">Like</span>
        </button>
        <button className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition">
          <div className="p-3 rounded-full bg-gray-100 hover:bg-blue-50 transition">
            <MessageCircle size={20} />
          </div>
          <span className="text-xs mt-1">Message</span>
        </button> */}
        <button className="flex flex-col items-center text-gray-700 hover:text-green-500 transition">
          <div className="p-3 rounded-full bg-gray-100 hover:bg-green-50 transition">
            <Share2 size={20} />
          </div>
          <span className="text-xs mt-1">Share</span>
        </button>
      </div>

      {/* Profile details */}
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700">{about || "No bio added yet."}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Basic Info</h2>
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{name || "Not specified"}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{emailId || "Not specified"}</span>
            </div>
            {gender && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium capitalize">{gender}</span>
              </div>
            )}
            {age && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-gray-500">Age</span>
                <span className="font-medium">{age} years</span>
              </div>
            )}
            {town && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">{town} {pincode && `- ${pincode}`}</span>
              </div>
            )}
          </div>
        </div>

        <Link 
          to="/editProfile" 
          className="block w-full py-3 px-4 bg-purple-600 text-white text-center rounded-xl font-medium hover:bg-purple-700 transition shadow-sm"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default Profile;