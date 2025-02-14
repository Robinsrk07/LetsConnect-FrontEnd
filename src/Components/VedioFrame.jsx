import React from "react";

const VideoFrame = ({ endVideoCall, localVideoRef, remoteVideoRef }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex gap-4">
                <video ref={localVideoRef} autoPlay muted className="w-48 h-36 rounded-lg shadow-lg" />
                <video ref={remoteVideoRef} autoPlay className="w-48 h-36 rounded-lg shadow-lg" />
            </div>
            <button className="btn btn-error mt-4" onClick={endVideoCall}>
                End Call
            </button>
        </div>
    );
};

export default VideoFrame;