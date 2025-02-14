import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addRequest } from "./utils/requestSlice"
import { useEffect, useState } from "react"
import { BASE_URL } from "./utils/Constants"
import { addConnection } from "./utils/connectionSlice"

const Request = () => {
  const dispatch = useDispatch()
  const request = useSelector((store) => store.request)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const requestReceive = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get(`${BASE_URL}/userService/requests/received`, {
        withCredentials: true
      })
      console.log(response.data);
      
      dispatch(addRequest(response.data))
    } catch (error) {
      console.error("Error fetching requests:", error)
      setError("Failed to load requests. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const reviewRequest = async (status, UserID) => {
    try {
      await axios.post(`${BASE_URL}/userService/request/review/${status}/${UserID}`, {}, {
        withCredentials: true
      })
      if(status==="accepted"){
        const response =await axios.get(BASE_URL + "/userService/connection",{withCredentials:true})
        dispatch(addConnection(response.data.data))
      }
      
      requestReceive()
    } catch (err) {
      console.error("Error reviewing request:", err)
      alert("Failed to process request. Please try again.")
    }
  }

  useEffect(() => {
    requestReceive()
  }, []) 

  if (isLoading) {
    return <div className="p-4">Loading requests...</div>
  }

  if (error) {
    return <div className="p-4 text-error">{error}</div>
  }

  if (!request?.data?.length) {
    return <div className="p-4">No pending requests</div>
  }

  return (
    <div className="space-y-4">
      {request.data.map((connection) => {
        const { firstName, lastName, photoUrl, age, gender, about, emailId} = connection.senderId
        const{_id}=connection

        return (
          <div key={connection._id} className="m-4 p-4 rounded-lg bg-base-200">
            <div className="flex items-center gap-4">
              <img
                src={photoUrl?.[1] || '/default-avatar.png'}
                alt={`${firstName}'s profile`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">
                  {firstName} {lastName}
                </h3>
                <p className="text-sm">
                  {age} years • {gender}
                </p>
                {about && <p className="mt-2">{about}</p>}
                {emailId && <p className="mt-2">{emailId}</p>}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => reviewRequest("accepted", _id)}
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-success"
                >
                  ACCEPT
                </button>
                <button
                  onClick={() => reviewRequest("rejected", _id)}
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-error"
                >
                  REJECT
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Request