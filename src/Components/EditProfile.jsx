import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
//import { BASE_URL } from "./utils/Constants"
import { useEffect, useState } from "react"
import { addUser } from "./utils/userSlice" 
const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE

const EditProfile = () => {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()

 
  const[error,setError] = useState({
    firstName:null,
    lastName:null,
    age:null,
    gender:null,
    about:null,
    skills:null,
    photoUrl:null
  })


  const validateinput= (name,value)=>{
    switch(name){
        case "firstName":
            if(!value)return "*Required Feild";
            if(value.length<3) return "first name must be at least 3 characters";
            if(value.length>50) return "fisrt name cannot exceed 50 character";
            if (!/^[A-Za-z\s]+$/.test(value)) return 'First name can only contain letters and spaces';
            return ""

       case 'lastName':
                if (!value) return 'Last name is required';
                if (value.length < 3) return 'Last name must be at least 3 characters';
                if (value.length > 40) return 'Last name cannot exceed 40 characters';
                if (!/^[A-Za-z\s]+$/.test(value)) return 'Last name can only contain letters and spaces';
                return '';
        
       case 'age':
                if (!value) return 'Age is required';
                if (isNaN(value) || value < 18 || value > 100) return 'Age must be between 18 and 100';
                return '';
        
        case 'about':
                if (value.length > 500) return 'About section cannot exceed 500 characters';
                return '';
        
        case 'skills':
                if (value.length > 10) return 'Cannot have more than 10 skills';
                return '';
        
              default:
                return '';

    }
  }


const[status,setStatus]= useState(false)
  const [firstName, setFirstname] = useState('')
  const [lastName, setLastname] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [about, setAbout] = useState('')
  const [skills, setSkills] = useState([])
  const [photoUrl, setPhotoUrl] = useState([])

  
  useEffect(() => {
    if (user) {
      setFirstname(user.firstName || '')
      setLastname(user.lastName || '')
      setAge(user.age || '')
      setGender(user.gender || '')
      setAbout(user.about || '')
      setSkills(user.skills || [])
      setPhotoUrl(user.photoUrl || [])
    }
  }, [user])

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/userService/profile/view`, {
        withCredentials: true
      })
      dispatch(addUser(res.data)) 
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [user]) 

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      const newError ={
        firstName: validateinput('firstName',firstName),
        lastName: validateinput('lastName',lastName),
        age:validateinput('age',age),
        gender:'',
        about:validateinput('about',about),
        skills:validateinput('skills',skills),
        photoUrl:''
      }
      console.log("error",newError);
      
  if(Object.values(newError).some((erroMessage)=>erroMessage !=='')){

    setError(newError)
   return
  }

        setError({
            firstName: null,
            lastName: null,
            age:null,
            gender:null,
            about:null,
            skills:null,
            photoUrl:null
          })
      const updatedData = {
        firstName,
        lastName,
        age,
        gender,
        about,
        skills,
        photoUrl
      }

      console.log("hello");
      
      const response = await axios.patch(`${BASE_URL}/userService/profile/edit`, updatedData, {
        withCredentials: true
      })
   if(response.status==200){
    setStatus(true)
    setInterval(()=>{setStatus(false)},3000)
    fetchUser()
   }   
     
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (!user) {
    return <div>...loading</div>
  }

  return (
    <div className="flex justify-center my-10">
      <div className="card card-side bg-base-300 shadow-xl">
        <figure>
          <img src={photoUrl[1]} alt="Profile" className="w-64 h-64 object-cover" />
        </figure>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label className="form-control w-full max-w-xs">
           { status && <div role="alert" className="alert alert-success mb-2">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Information updated !</span>
</div>}
            {error.firstName && <div role="alert" className="alert alert-error mt-3 ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error.firstName}</span>
                    </div>}
              <input
                type="text"
                placeholder="FirstName"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
               {error.lastName && <div role="alert" className="alert alert-error mt-3 ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error.lastName}</span>
                    </div>}
              <input
                type="text"
                placeholder="LastName"
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
                className="input input-bordered w-full max-w-xs mt-4"
              />
              {error.age && <div role="alert" className="alert alert-error mt-3 ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error.age}</span>
                    </div>}
              <input
                type="number"
                placeholder="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input input-bordered w-full max-w-xs mt-4"
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full max-w-xs mt-4"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {error.about && <div role="alert" className="alert alert-error mt-3 ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error.about}</span>
                    </div>}
              <textarea
                placeholder="About"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="textarea textarea-bordered w-full max-w-xs mt-4"
              />
              {error.skills && <div role="alert" className="alert alert-error mt-3 ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error.skills}</span>
                    </div>}
              <input
                type="text"
                placeholder="Skills (comma-separated)"
                value={skills.join(', ')}
                onChange={(e) => setSkills(e.target.value.split(',').map(skill => skill.trim()))}
                className="input input-bordered w-full max-w-xs mt-4"
              />
             
             <input
             type="text"
             placeholder="photoUrl"
             value={photoUrl.join(",")}
             onChange={(e)=>setPhotoUrl(e.target.value.split(',').map(photo=>photo.trim()))}
             className="input input-bordered w-full max-w-xs mt-4"
             />
              <button type="submit" className="btn btn-primary mt-4">
                Save Changes
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile