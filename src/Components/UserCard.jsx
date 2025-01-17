import axios from "axios";
import { BASE_URL } from "./utils/Constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "./utils/feedSlice";

const UserCard = ({ user }) => {
    const dispatch = useDispatch();
    const { firstName, lastName, photoUrl, age, gender, about, _id } = user;

    const handleSendRequest = async (status, toUserId) => {
        try {
            await axios.post(
                `${BASE_URL}/request/send/${status}/${toUserId}`,
                {},
                { withCredentials: true }
            );
            
            dispatch(removeFeed(toUserId));
        } catch (err) {
            console.error("Error sending request:", err);
        }
    };

    return (
        <div className="card card-compact bg-base-100 w-96 shadow-xl">
            <figure>
                <img
                    src={photoUrl[0]}
                    alt={`${firstName}'s photo`}
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {firstName} {lastName}
                </h2>
                {age && gender && (
                    <p>
                        {age} {gender}
                    </p>
                )}
                <p>{about}</p>
                <div className="card-actions justify-between">
                    <button 
                        onClick={() => handleSendRequest("interested", _id)} 
                        className="btn btn-success"
                    >
                        Interested
                    </button>
                    <button 
                        onClick={() => handleSendRequest("ignored", _id)} 
                        className="btn btn-error"
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserCard;