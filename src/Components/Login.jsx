import { useState } from "react"; 
import axios from 'axios';
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "./utils/Constants";
import { validateName, validateEmailId, validatePassword, validateConfirmPassword } from './utils/formValidation';
import { useEffect } from "react";


const Login = () => {
    const[firstName,setFirstName] = useState("robin");
    const[lastName,setLastName] = useState("cyriak");
    const[emailId,setEmailId] = useState('robincyriak07@gmail.com');
    const[password,setPassword] =useState('Abc@1234');
    const[confirmPassword,setConfirmPassword]=useState("Abc@1234");
    const[image,setImage]=useState(null);
    const [imageUrls, setImageUrls] = useState([]);  // To store the URLs of images

    const[previews, setPreviews] = useState([]);
    const[skills,setSkills] = useState([]);
    const[age,setAge] = useState(null);
    const[gender,setGender]=useState(null);
    const[dropDown,setDropDown]=useState(false);
    const[about,setAbout]=useState('');
    const[error,setError] = useState(null);
    const[isLogin,setIsLogin]=useState(false);
    const[next,setNext]=useState(false);
    const[upload,setUplaod] =useState(false);
    const[phone,setPhone]= useState(null);
    const[verifyOtp,setVerifyOtp]=useState(false);
    const[otp,setOtp]= useState(false);
    const[otpSign,setOtpSign]=useState();
    const[otpSucces,setOtpSuccess] = useState(false);
    const[succesSign,setSuccesSign] = useState(false);
    const[otpError,setOtpError] = useState(false)
    const[signupError,setSignUpError]=useState(false)

    const[errors,setErrors]= useState({
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      confirmPassword: ""
    })
 
   useEffect(() => {
    const newErrors = {
        firstName: validateName(firstName),
        lastName: validateName(lastName),
        emailId: validateEmailId(emailId),
        password: validatePassword(password),
        confirmPassword: validateConfirmPassword(password, confirmPassword)
    };
    setErrors(newErrors);
}, [firstName, lastName, emailId, password, confirmPassword]); 


    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogin = async () => {
        try {
            const res = await axios.post(BASE_URL + '/login', {
                emailId, password
            }, { withCredentials: true });
            dispatch(addUser(res.data));
            navigate("/profile", { replace: true });
        } catch (err) {
            console.error(err.message);
            setError("Invalid Credentials");
        }
    };

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files); // Convert FileList to an array
      setImage(files);

      // Generate object URLs for preview
      const previewsArray = files.map((file) => URL.createObjectURL(file));
      setPreviews(previewsArray);

      // Generate URLs (or base64) to send to the backend
      const imageUrls = files.map((file) => URL.createObjectURL(file));  // Replace with base64 if needed
      setImageUrls(imageUrls);
  };


    const handleSkill = (e) => {
        const value = e.target.value;
        const arraySkills = value.split(/[\s,]+/).filter(skill => skill.trim() !== "");
        setSkills(arraySkills);
    };

    const handleClick = () => {
        setDropDown(!dropDown);
    };

    const handleItemClick = (gender) => {
        setGender(gender);
        setDropDown(false);
    };
    const handleOtp =async()=>{
      try{
        const res= await axios.post(BASE_URL + "/send-otp",{email:emailId},{withCredentials:true})
        if(res.status==200){
          setOtp(true)
          setVerifyOtp(true)
        }else{
          console.error(res.message);
          
        }

      }catch(error){
        console.error("Error while sending OTP:", error.message);

      }
     
     
    };




    const handleOtpverify=async()=>{
      try{
        const res = await axios.post(BASE_URL + "/verify-otp",{otp:otpSign,email:emailId},{withCredentials:true})
     
        setOtpSuccess(true)
        setOtpError(false)
      }catch(err){
         setOtpError(true)
          console.error("Otp verification failed");
      }};






      const handleSignUp =async()=>{
        try {
          const res = await axios.post(BASE_URL + "/signup",{
            firstName:firstName,
            lastName:lastName,
            emailId:emailId,
            password:password,
            about:about,
            photoUrl:imageUrls,
            skills:skills,
            age:age,
            gender:gender
          },{withCredentials:true})
          dispatch(addUser(res.data));
          navigate("/", { replace: true });
          
        } catch (error) {
            setSignUpError(true)
          console.error(error);
          
        }

      };
      
      const isFormValid = validateName(firstName) === "" && 
      validateName(lastName) === "" && 
      validateEmailId(emailId) === "" && 
      validatePassword(password) === "" && 
      validateConfirmPassword(password, confirmPassword) === "";


//const uploadValid = about && image && skills && age && gender 
    const otpVerify = next && upload && !isLogin

    return (
        <div>
            {!isLogin && (
                <ul className="steps mt-9">
                    <li className={next ? "step step-primary" : "step"}>Information</li>
                    <li className={ upload?"step step-primary" : "step"}>Upload</li>
                    <li className={ otp?"step step-primary" : "step"}>Verify OTP</li>
                    <li className={succesSign? "step step-primary":"step"}>SIGNUP</li>
                </ul>
            )}
            
            <div className="flex justify-center my-10">
                <div className="card card-side bg-base-300 shadow-xl">
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                            alt="Movie"
                        />
                    </figure>
                    <div className="card-body">
                     
                        <h2 className="card-title">{otpSucces?"Sign up":otpVerify?"VERIFY OTP" :isLogin ? "LOGIN" : "SIGNUP"}</h2>
                        
                        {/* Information Section */}
                        {isLogin && (<div>
                                <div className="label">
                                    <span className="label-text">Email ID</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Email ID"
                                    className="input input-bordered w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                />

                                <div className="label">
                                    <span className="label-text">Password</span>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input input-bordered w-full max-w-xs"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                /></div>)}
                        {!next && !isLogin && (
                            <div>
                                <div className="label">
                                    <span className="label-text">First Name</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                  {errors.firstName && (
                    <div className="text-error text-sm mt-1">{errors.firstName}</div>
                )} 
                                <div className="label">
                                    <span className="label-text">Last Name</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                {errors.lastName && (
                    <div className="text-error text-sm mt-1">{errors.lastName}</div>
                )}

                                <div className="label">
                                    <span className="label-text">Email ID</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Email ID"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                />
                                 {errors.emailId && (
                    <div className="text-error text-sm mt-1">{errors.emailId}</div>
                )}
                                <div className="label">
                                    <span className="label-text">Password</span>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                 {errors.password && (
                    <div className="text-error text-sm mt-1">{errors.password}</div>
                )}

                                <div className="label">
                                    {password !== confirmPassword ? (
                                        <span className="text-danger">Passwords do not match</span>
                                    ) : (
                                        <span className="label-text">Confirm Password</span>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
{errors.confirmPassword && (
                    <div className="text-error text-sm mt-1">{errors.confirmPassword}</div>
                )}
                                {isFormValid && !next && (
                                    <button
                                        onClick={() => setNext(true)}
                                        className="btn btn-active btn-neutral w-24 h-12 m-9 rounded"
                                    >
                                        NEXT
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Upload Section */}
                        {next && !isLogin && !upload && (
                            <div>
                                <div className="label">
                                    <span className="label-text">Tell us about yourself...</span>
                                </div>
                                <textarea
                                    placeholder="Tell us about yourself..."
                                    className="input input-bordered w-full max-w-xs rounded"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                />

                                <div className="label">
                                    <span className="label-text">Upload Photos</span>
                                </div>
                                <input
                                    type="file"
                                    className="input input-bordered w-full max-w-xs  rounded"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />

                                <div className="image-preview flex">
                                    {previews.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`preview-${index}`}
                                            style={{ width: '100px', height: '100px', margin: '5px' }}
                                        />
                                    ))}
                                </div>

                                <div className="label">
                                    <span className="label-text">Skills</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your Skills"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    onChange={handleSkill}
                                />

                                <div className="label">
                                    <span className="label-text">Age</span>
                                </div>
                                <input
                                    type="number"
                                    min="18"
                                    max="60"
                                    placeholder="Age"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    onChange={(e) => setAge(e.target.value)}
                                />

                                <div className="label">
                                    <span className="label-text">Gender</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Gender"
                                    className="input input-bordered w-full max-w-xs rounded"
                                    value={gender}
                                    onClick={handleClick}
                                />
                                {dropDown && (
                                    <div className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow absolute mt-1">
                                        <ul>
                                            <li><a onClick={() => handleItemClick('Male')}>Male</a></li>
                                            <li><a onClick={() => handleItemClick('Female')}>Female</a></li>
                                            <li><a onClick={() => handleItemClick('Other')}>Other</a></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                          
                             { about && skills && age && gender && isFormValid && next && !upload &&(<div>
                                    <button className="btn btn-active btn-neutral w-24 h-12 m-9 rounded" onClick={() => setUplaod(true)}>
                                      next
                                    </button>
                                    <button className="btn btn-active btn-neutral w-24 h-12 m-9 rounded" onClick={() => {setNext(false)
                                      setUplaod(false)
                                    }}>
                                      back
                                    </button>
                                    </div>

                             )

                             }


                            {/*otp verification */}

                          {next && !isLogin&& upload && !verifyOtp &&(
                            <>
                           <div className="label">
                           <span className="label-text">Phone Number</span>
                       </div>
                       <input
                           type="tel"
                           placeholder="Phone Number"
                           className="input input-bordered w-full max-w-xs rounded"
                           pattern="[0-9]{10}"  
                           maxLength="10"
                           onChange={(e) => setPhone(e.target.value)}  
                           required
                       /></>
                       
                          )}


                          {/*verify otp*/}
                          
                          {next && !isLogin&& upload && verifyOtp && !otpSucces && (
                            <>
                           <div className="label">
                           <span className="label-text">ENTER YOUR OTP</span>
                       </div>
                       <input
                           type="tel"
                           placeholder="Enter otp"
                           className="input input-bordered w-full max-w-xs rounded"
                           pattern="[0-9]{10}"  
                           maxLength="10"
                           onChange={(e) => setOtpSign(e.target.value)}  
                           required
                       /></>
                       
                          )}{otpError&& (
                            <div className="text-error text-sm mt-1">{"invalid otp"}</div>
                        )}
                         



                        {/* Login Button */}
                        <div className="card-actions justify-end">
                            {error && (
                                <div role="alert" className="alert alert-error">
                                    <span>{error}</span>
                                </div>
                            )}
                            {isLogin ? (
                                <button className="btn btn-primary" onClick={handleLogin}>LOGIN</button>
                            ) : null}
                            {phone && isFormValid && next && upload && (
                              <div>
                                {
                                    <button className="btn btn-active btn-neutral w-24 h-12 m-9 rounded" >Back</button>
                                }
                           
                                {otpSucces?<button className="btn btn-active btn-neutral w-24 h-12 m-9 rounded" onClick={handleSignUp} >SignUP</button>:otpSign?<button className="btn btn-active btn-neutral w-24 h-12 m-9 rounded" onClick={handleOtpverify} >Verify Otp</button>:
                                <button className="btn btn-active btn-neutral w-24 h-12 m-9 rounded" onClick={handleOtp} >GETOTP</button>
                                
                                
                                }
                                {signupError && (
                                        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
                                            <div className="max-w-md w-full bg-white shadow-lg p-8">
                                            <div className="flex flex-col items-center space-y-4">
                                                {/* Simple error circle */}
                                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                <span className="text-4xl text-red-500">!</span>
                                                </div>
                                                
                                                <h2 className="text-2xl font-semibold">Account Already Exists</h2>
                                                
                                                <p className="text-gray-600 text-center">
                                                An account with this email already exists. Please login to continue.
                                                </p>

                                                <div className="flex flex-col w-full gap-3">
                                                {/* <button 
                                                    onClick={() => setIsLogin(true)}
                                                    className="btn btn-active btn-neutral w-full rounded"
                                                >
                                                    Go to Login
                                                </button> */}
                                                
                                             ?
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        )}
                                
                              </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toggle Login/Signup */}
            <div>
                <input
                    onChange={() => setIsLogin(!isLogin)}
                    type="checkbox"
                    className="toggle"
                    defaultChecked={isLogin}
                />
                <p>{isLogin ? "SIGNUP" : "LOGIN"}</p>
            </div>
        </div>
    );
};

export default Login;
