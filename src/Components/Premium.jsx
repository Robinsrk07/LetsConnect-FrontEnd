import axios from "axios";
import { useState } from "react";
//import { BASE_URL } from "./utils/Constants";
const BASE_URL = import.meta.env.VITE_API_URL_PAYMENT_SERVICE

const Premium = () => {

const[isUserPremium,setUserPremium] = useState(false);


const verifyPremiumUser = async()=>{
 const res = await axios.get( `${BASE_URL}/payment/premium/verify`,{},{withCredentials:true})
 
if(res.data.isPremium){
  setUserPremium(true)
}

}
 const  handleCreateOrder=async(type)=>{

const res = await axios.post( `${BASE_URL}/payment/createOrder`,

  
 {
  membershipType :type
}
,{withCredentials:true});
console.log(res)
console.log(res.data);

const {amount,currency,orderId,notes}= res.data.order
console.log(amount);

const{key_id}= res.data

const options = {
  key: key_id, // Replace with your Razorpay key_id
  amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  currency: currency,
  name: 'LetsConnect',
  description: 'Transaction',
  order_id:orderId, // This is the order_id created in the backend
 // callback_url: 'http://localhost:3000/payment-success', // Your success URL
  prefill: {
    name: notes.firstName + " " + notes.lastName,
  
  },
  theme:{
    color:"#E37254"
  },
 handler : verifyPremiumUser

 }
const rzp = new window.Razorpay(options);
      rzp.open();
}

  
  return isUserPremium ? (<div>you are premium user</div>): (
  <div className="flex justify-center gap-8 p-8">
  
    <div className="bg-golden rounded-lg shadow-lg p-6 w-72 mt-10">
    <h3 className="text-2xl font-semibold text-center text-blue-700 mb-4">Golden  Plan</h3>
      <p className="text-xl font-bold text-center text-blue-800 mb-6"> ₹ 999/ month</p>
      <ul className="space-y-4 text-sm text-gray-700 mb-6">
        <li>Unlimited  Connections</li>
        <li>Priority Support</li>
        <li>Exclusive Content</li> 
        <li>Customizable Settings</li>
      </ul>
      <button onClick={()=>handleCreateOrder("gold")}  className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
        Subscribe Now
      </button>
    </div>

    
    <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-72 mt-10">
      <h3 className="text-2xl font-semibold text-center text-gray-700 mb-4">Silver Plan</h3>
      <p className="text-xl font-bold text-center text-gray-800 mb-6">₹ 399/ month</p>
      <ul className="space-y-4 text-sm text-gray-700 mb-6">
        <li>Limited Access</li>
        <li>100 Requstes / day</li>
        <li>ff</li>
        <li>ff</li>
      </ul>
      <button   onClick={()=>handleCreateOrder("silver")} className="w-full py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition duration-200">
        Subscribe Now
      </button>
    </div>
  </div>
  );

}
export default Premium;
