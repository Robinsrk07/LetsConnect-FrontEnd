import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "./utils/Constants"
import { addFeed } from "./utils/feedSlice"
import { useEffect } from "react"
import UserCard from "./UserCard.jsx"



const Feed =()=>{

  const feed=useSelector((store)=>store.feed)
 
  console.log("feed",feed);
  
  const dispatch =useDispatch()

  const getFeed =async()=>{
    if(feed) return
    try{
        const res = await axios.get(BASE_URL +"/userService/feed",{withCredentials:true});     
        console.log("response",res);
           
        dispatch(addFeed(res.data))
    }catch(err){
        console.error(err);
    }
     }
    useEffect(()=>{
        getFeed()
              },[])
if(!feed) return
 if(feed==null|| feed.users.length==0||feed.users== undefined)return  (<div>no users found</div>)

    return (
       
        <div className=" flex justify-center my-10">
              <UserCard user={feed.users[0]}/>
                 
        </div>
        
    )
    
}
export default Feed
