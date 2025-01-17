import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./utils/Constants";
import { addUser } from "./utils/userSlice";
import { useEffect } from "react";
import { Link } from "react-router";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const resp = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
      dispatch(addUser(resp.data));
    } catch (err) {
      console.log(err);
      
            }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []); 

  if (!user) {
    return <div>Loading...</div>;
  }

  const { about, emailId, firstName, lastName, photoUrl, skills,age} = user;

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <div className="carousel carousel-vertical rounded-box h-96">
            {photoUrl?.map((image, index) => (
              <div key={index} className="carousel-item h-full">
                <img src={image} alt={`Profile ${index + 1}`} className="w-full object-cover" />
              </div>
            ))}
          </div>
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          <p>{emailId}</p>
          <p>{age}</p>
          <p>{about}</p>
          <div className="flex flex-wrap gap-2">
            {skills?.map((skill, index) => (
              <span key={index} className="badge badge-primary">
                {skill}
              </span>
            ))}
          </div><Link to="/editProfile"><button className="btn">Edit Profile</button>
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;