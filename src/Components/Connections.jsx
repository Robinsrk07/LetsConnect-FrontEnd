import axios from "axios";
import { BASE_URL } from "./utils/Constants";
import { useEffect, useState } from "react";
import { addConnection } from "./utils/connectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connection);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConnection = async () => {
        try {
            const response = await axios.get(BASE_URL + "/userService/connection", { withCredentials: true });
            dispatch(addConnection(response.data.data));
            setError(null);
        } catch (error) {
            console.error("Error fetching connections:", error);
            setError("Failed to fetch connections. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (connections.length === 0) {
            fetchConnection();
        }
    }, [connections]);

    if (isLoading) {
        return (
            <div className="mt-10">
                <span className="loading loading-bars loading-xs"></span>
                <span className="loading loading-bars loading-sm"></span>
                <span className="loading loading-bars loading-md"></span>
                <span className="loading loading-bars loading-lg"></span>
                <span>Loading connections...</span>
            </div>
        );
    }

    if (error) {
        return <div className="mt-10 text-red-500">{error}</div>;
    }

    if (connections.length === 0) {
        return <div className="mt-10">No connections yet.</div>;
    }

    return (
        <div>
            {connections.map((connection) => {
                const { firstName, lastName, photoUrl, age, gender, about, _id } = connection;

                return (
                    <div key={_id} className="m-4 p-4 rounded-lg bg-base-200">
                        <div className="flex items-center gap-4">
                            <img
                                src={photoUrl[0] || '/default-avatar.png'}
                                alt={`${firstName}'s profile`}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold">{firstName} {lastName}</h3>
                                <p className="text-sm">{age} years • {gender}</p>
                                {about && <p className="mt-2">{about}</p>}
                            </div>
                            <div className="flex gap-4">
                                <Link to={"/chat/" + _id}>
                                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-success">Send Message</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Connections;