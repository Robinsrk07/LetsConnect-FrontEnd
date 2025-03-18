import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "./utils/requestSlice";
import { useEffect, useState } from "react";
import { addConnection } from "./utils/connectionSlice";
import { Check, X, Loader, Users, Bell } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE;

const Request = () => {
  const dispatch = useDispatch();
  const request = useSelector((store) => store.request);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  console.log("request",request);
  

  const requestReceive = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/userService/requests/received`, {
        withCredentials: true
      });
      dispatch(addRequest(response.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to load requests. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const reviewRequest = async (status, userId) => {
    try {
      setActionInProgress(userId);
      await axios.post(`${BASE_URL}/userService/request/review/${status}/${userId}`, {}, {
        withCredentials: true
      });
      
      if (status === "accepted") {
        const response = await axios.get(`${BASE_URL}/userService/connection`, {
          withCredentials: true
        });
        dispatch(addConnection(response.data.data));
      }
      
      requestReceive();
    } catch (err) {
      console.error("Error reviewing request:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  useEffect(() => {
    requestReceive();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin mb-4">
            <Loader size={36} className="text-purple-500" />
          </div>
          <p className="text-gray-500">Loading requests...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={requestReceive}
            className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!request?.data?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Bell size={24} className="text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
          <p className="text-gray-500">You don't have any connection requests at the moment.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {request.data.map((connection) => {
          const { name, photoUrl, gender, about, emailId } = connection.senderInfo;
          const { _id } = connection;
          return (
            <div key={_id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Profile image section */}
                <div className="sm:w-1/3 md:w-1/4">
                  <div className="relative pt-[100%] sm:pt-0 sm:h-full">
                    <img
                      src={photoUrl?.[0] || '/default-avatar.png'}
                      alt={`${name}'s profile`}
                      className="absolute inset-0 w-full h-full object-cover sm:static"
                    />
                  </div>
                </div>
                
                {/* Info section */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{name}</h3>
                      {gender && (
                        <span className="text-sm text-gray-500 capitalize">{gender}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewRequest("accepted", _id)}
                        disabled={actionInProgress === _id}
                        className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition disabled:opacity-50"
                      >
                        {actionInProgress === _id ? (
                          <div className="animate-spin">
                            <Loader size={16} className="text-white" />
                          </div>
                        ) : (
                          <Check size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => reviewRequest("rejected", _id)}
                        disabled={actionInProgress === _id}
                        className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition disabled:opacity-50"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {about && (
                    <div className="mb-2">
                      <p className="text-gray-700">{about}</p>
                    </div>
                  )}
                  
                  {emailId && (
                    <div className="mt-auto pt-2 text-sm text-gray-500">
                      {emailId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center">
          <Bell size={20} className="mr-2" />
          Connection Requests
        </h1>
        <p className="text-gray-500 text-center">
          {request?.data?.length 
            ? `You have ${request.data.length} pending ${request.data.length === 1 ? 'request' : 'requests'}`
            : 'Review people interested in connecting with you'}
        </p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default Request;