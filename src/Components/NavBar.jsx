 import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
 import { Link, useNavigate } from "react-router";
//import { BASE_URL } from "./utils/Constants";
import { removeUser } from "./utils/userSlice";
const BASE_URL = import.meta.env.VITE_API_URL_AUTH_SERVICE

const Navbar = () => {

  const user = useSelector((store)=>store.user)  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout =async()=>{
      try{
       await axios.post(`${BASE_URL}/auth/logout`,{},{withCredentials:true})
       dispatch(removeUser())
       navigate('/login')

      }catch(err){
        console.error(err);
        
      }
  }
  

  return (
    <div className="navbar bg-base-300">
    <div className="flex-1">
      <Link to="" className="btn btn-ghost text-xl">LetsConnect</Link>
    </div>
    <div className="flex-none gap-2">
      <div className="form-control">
        <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
      </div>
      {user &&<div className="dropdown dropdown-end mx-6">
        <p>Welcome ,{user.firstName} </p>
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
          {/* <img
            alt="Tailwind CSS Navbar component"
            src={user.photoUrl[1]} /> */}
        </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <Link to="/profile" className="justify-between">
              Profile
              <span className="badge">New</span>
            </Link>
          </li>
          <li><Link to="/connections">Connections</Link></li>
          <li><Link to="/requests">Requests</Link></li>
          <li><a onClick={handleLogout}>Logout</a></li>
        </ul>
      </div>}
    </div>
  </div>
  )
}

export default Navbar
