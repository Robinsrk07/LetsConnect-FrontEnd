import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "./utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard.jsx";
import { Loader } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE;

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const getFeed = async () => {
    if (feed && feed.users && feed.users.length > 0) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`${BASE_URL}/userService/feed`, { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError("Failed to load matches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    getFeed();
  }, []);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="animate-spin">
            <Loader size={40} className="text-purple-500" />
          </div>
          <p className="mt-4 text-gray-500">Finding matches for you...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={getFeed}
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (!feed || !feed.users || feed.users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">😢</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No matches found</h3>
          <p className="text-gray-500 mb-4">We couldn't find any matches for you right now. Check back later!</p>
          <button 
            onClick={getFeed}
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Refresh
          </button>
        </div>
      );
    }
    
    return <UserCard user={feed.users[0]} />;
  };
  
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Discover</h1>
        <p className="text-gray-500 text-center">Find your perfect match</p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Feed;