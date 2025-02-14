import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ShimmerChat = () => {
    return (
        <div className="space-y-4">
            <Skeleton height={50} width={"50%"} borderRadius={8} />
            <Skeleton height={50} width={"70%"} borderRadius={8} />
            <Skeleton height={50} width={"60%"} borderRadius={8} />
        </div>
    );
};

export default ShimmerChat;