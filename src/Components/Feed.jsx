import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
//import { BASE_URL } from "./utils/Constants"
import { addFeed } from "./utils/feedSlice"
import { useEffect } from "react"
import UserCard from "./UserCard.jsx"

const BASE_URL = import.meta.env.VITE_API_URL_USER_SERVICE

const Feed = () => {
    const feed = useSelector((store) => store.feed);
    const dispatch = useDispatch();

    console.log("feed", feed);

    const getFeed = async () => {
        if (feed) return;
        try {
            const res = await axios.get(`${BASE_URL}/userService/feed`, { withCredentials: true });
            console.log("response", res);
            dispatch(addFeed(res.data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getFeed();
    }, []);

    if (!feed) return <div>Loading...</div>;
    if (feed.users.length === 0) return <div>No users found</div>;

    return (
        <div className="flex justify-center my-10">
            <UserCard user={feed.users[0]} />
        </div>
    );
};

export default Feed;