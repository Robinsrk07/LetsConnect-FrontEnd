import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeed } from "./utils/feedSlice";
import { Heart, X, MapPin, Info } from "lucide-react";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE;

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const { name, photoUrl, gender, about, town, pincode, userId, age } = user;
  
  const handleSendRequest = async (status, toUserId) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/userService/request/send/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );
      
      // Dispatch removeFeed action to update the Redux state
      dispatch(removeFeed(toUserId));
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Truncate about text if it's too long
  const truncateAbout = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Card Image */}
      <div className="relative h-[500px]">
        <img 
          src={photoUrl?.[0] || "https://via.placeholder.com/400x600"} 
          alt={`${name}'s photo`} 
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
        
        {/* Info button */}
        <button 
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={20} className="text-white" />
        </button>
        
        {/* Basic info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="text-2xl font-bold mb-1 flex items-center">
            {name} <span className="ml-2 text-xl">{age && `• ${age}`}</span>
          </h2>
          
          {town && (
            <div className="flex items-center mb-2 text-white/80">
              <MapPin size={16} className="mr-1" />
              <span>{town} {pincode && `- ${pincode}`}</span>
            </div>
          )}
          
          {gender && (
            <div className="mb-2 text-white/80 text-sm capitalize">
              {gender}
            </div>
          )}
          
          {about && (
            <p className={`text-sm text-white/90 transition-all duration-300 ${
              showInfo ? "max-h-32 overflow-y-auto" : "max-h-10 overflow-hidden"
            }`}>
              {showInfo ? about : truncateAbout(about)}
            </p>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between p-4">
        <button
          onClick={() => handleSendRequest("ignored", userId)}
          disabled={isLoading}
          className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <X size={28} className="text-red-500" />
        </button>
        
        <button
          onClick={() => handleSendRequest("interested", userId)}
          disabled={isLoading}
          className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Heart size={28} className="text-green-500" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;