import { Outlet, useNavigate } from "react-router"
import NavBar from "./NavBar"
import Footer from "./Footer"
import axios from "axios"
//import { BASE_URL } from "./utils/Constants"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "./utils/userSlice"
import { useEffect } from "react"
import "../assets/Body.css"
import { useState } from "react"


const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE
const Body = () => {
    const  dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store)=>{store.user})
    const[isModalLogin,setIsLoginModalOpen] = useState(false)
    const fetchUser = async()=>{

      if(userData)return ;
      try{
           const res =await axios.get(`${BASE_URL}/userService/profile/view`,{withCredentials:true})

           dispatch(addUser(res.data))
      }catch(err){
        console.log(err);
        
        //if(err.status == 401){navigate('/login')}
      }
    }
     
    useEffect(()=>{
        fetchUser();
    })
    const handleLoginClick = () => {
      setIsLoginModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsLoginModalOpen(false);
    };
  return (
    <div>
      <NavBar className="navbar" onLoginClick ={handleLoginClick} ></NavBar>
      <div className="body-content">
      <Outlet context= {{isModalLogin,handleCloseModal}} />
      </div>

      <Footer className="footer" ></Footer>
    </div>
  )
}

export default Body
