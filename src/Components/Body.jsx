import { Outlet, useNavigate } from "react-router"
import NavBar from "./NavBar"
import Footer from "./Footer"
import axios from "axios"
import { BASE_URL } from "./utils/Constants"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "./utils/userSlice"
import { useEffect } from "react"

const Body = () => {
    const  dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store)=>{store.user})
    const fetchUser = async()=>{

      if(userData)return ;
      try{
           const res =await axios.get(BASE_URL + "/userService/profile/view",{withCredentials:true})

           dispatch(addUser(res.data))
      }catch(err){
        if(err.status == 401){navigate('/login')}
      }
    }
     
    useEffect(()=>{
        fetchUser();
    })


  return (
    <div>
      <NavBar></NavBar>
      <Outlet/>
      <Footer ></Footer>
    </div>
  )
}

export default Body
