import axios from "axios"
import { BASE_URL } from "./utils/Constants"
import { useEffect } from "react"
import { addConnection } from "./utils/connectionSlice"
import { useDispatch, useSelector } from "react-redux"

const Connections = () =>{
const dispatch = useDispatch()
  const  connections=  useSelector((store)=>store.connection)
  
   const fetchConnection =async()=>{
    try{
     const response =await axios.get(BASE_URL + "/user/connection",{withCredentials:true})
      dispatch(addConnection(response.data.data))
     
    }catch(error){
        console.log(error);
        
    }
   }

   useEffect(()=>{
    if(connections.length===0){fetchConnection()}
    
   })
  if(connections.length ===0){
    return (
        <div className="mt-10">
           <span className="loading loading-bars loading-xs"></span>
<span className="loading loading-bars loading-sm"></span>
<span className="loading loading-bars loading-md"></span>
<span className="loading loading-bars loading-lg"></span> 
 <span> No Connections yet</span>

        </div>
    )
  }

 

  return (
    <div>
      {connections.map((connection) => {
        const { firstName, lastName, photoUrl, age, gender, about } = connection
        
        return (
          <div key={connection._id} className="m-4 p-4 rounded-lg bg-base-200">
          <div className="flex items-center gap-4">
            <img
              src={photoUrl[0] || '/default-avatar.png'}
              alt={`${firstName}'s profile`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{firstName} {lastName}</h3>
              <p className="text-sm">{age} years • {gender}</p>
              {about && <p className="mt-2">{about}</p>}
            </div>
            <div className="flex gap-4">
              <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg  btn-success ">Send Message</button>
            </div>
          </div>
        </div>
        )
      })}
    </div>
  )
 }

 export default Connections