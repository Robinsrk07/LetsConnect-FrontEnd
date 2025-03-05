import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { createSocketConnection } from "./utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoFrame from "./VedioFrame";
//import {BASE_URL}  from "./utils/Constants"

const Chat = () => {
  const { toUserId } = useParams();

  console.log("touserId:",toUserId)
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
  const [onCall, setOnCall] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  const [toUser, setToUser] = useState(null); // To hold the recipient user
  const user = useSelector((store) => store.user);
  const socket = useRef(null);
  const userId = user?.userId;

  console.log(userId)

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(new RTCPeerConnection());
  const localStream = useRef(null);

  

  const startCall= async (audioOnly=false) => {
    setOnCall(true);
    setIsAudioOnly(audioOnly);

    const mediaConstraints = audioOnly
    ?{video:false,audio:true}:{video:true,audio:true}


    localStream.current = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    if(!audioOnly){
      localVideoRef.current.srcObject = localStream.current;
    }
   
    localStream.current.getTracks().forEach(track => pc.current.addTrack(track, localStream.current));



    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("iceCandidate", { candidate: event.candidate, toUserId });
      }
    };

       pc.current.ontrack = (event) => {
      if (!audioOnly) {
        remoteVideoRef.current.srcObject = event.streams[0];
      } else {
        // For audio-only calls, we still need to handle the remote audio stream
        const audioElement = new Audio();
        audioElement.srcObject = event.streams[0];
        audioElement.play();
      }
    };

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.current.emit("offer", { offer, toUserId,userId,isAudioOnly: audioOnly 
    });
  };
 
  const handleVideoCall = () => startCall(false);
  const handleAudioCall = () => startCall(true);



 const endCall = () => {
    setOnCall(false);
    setIsAudioOnly(false);
    
    // Stop all tracks in the local stream
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    
    pc.current.close();
    // Create a new RTCPeerConnection for future calls
    pc.current = new RTCPeerConnection();
  };




  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = {
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
        sender: user._id,
      };
      setInputMessage("");
      socket.current.emit("sendMessage", { newMessage, toUserId, userId });
    }
  };

  const fetchChat = async () => {
    try {
      const chat = await axios.post("http://localhost:5001/chat/chats" , { userId, toUserId }, { withCredentials: true });
      console.log(chat)
      setMessages(chat.data.messages);

    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchToUser = async (toUserId) => {
    try {
      const response = await axios.get("http://localhost:5001/chat/endUser", { params: { toUserId }, withCredentials: true });
      setToUser(response.data);
    } catch (err) {
      console.error("Error fetching endUser:", err);
    }
  };
 // const[touser]=toUser

  useEffect(() => {
    if (toUserId) fetchToUser(toUserId);
  }, [toUserId]);

  useEffect(() => {
    if (userId && toUserId) fetchChat();
  }, [userId, toUserId]);

  useEffect(() => {
    if (!userId || !toUserId) return;

    socket.current = createSocketConnection();

    socket.current.on("connect", () => {
      console.log("Socket connected with ID:", socket.current.id);
    });

    socket.current.on("disconnect", (reason) => {
      console.log("Socket disconnected. Reason:", reason);
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.current.emit("joinchat", { userId, toUserId });

    socket.current.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg.msg]);
    });

    socket.current.on("offer", async ({ offer, fromUserId }) => {
      if (fromUserId === toUserId) {
        setOnCall(true);
        setIsAudioOnly(isAudioOnly);
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: !isAudioOnly,
          audio: true
        });
        if (!isAudioOnly) {
          localVideoRef.current.srcObject = localStream.current;
        }


        await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socket.current.emit("answer", { answer, toUserId: fromUserId,userId });
      }
    });


    socket.current.on("answer", async ({ answer }) => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.current.on("iceCandidate", async ({ candidate }) => {
      try {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current.off();
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }

    };
  }, [userId, toUserId]);

  return (
    <div className="flex flex-col h-screen p-4 bg-base-200">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-base-200 z-10 p-4 border-b">
        <div className="flex items-center gap-2">
          <button 
            className="btn btn-info mr-2" 
            title="Start Video Call"
            onClick={handleVideoCall}
            disabled={onCall}
          >
            🎥
          </button>
          <button 
            className="btn btn-info" 
            title="Start Audio Call"
            onClick={handleAudioCall}
            disabled={onCall}
          >
            🎤
          </button>
          {onCall && (
            <button 
              className="btn btn-error ml-2" 
              onClick={endCall}
            >
              End Call
            </button>
          )}
        </div>
      </div>

      {!onCall ? (
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={`${message.timeStamp}-${message.senderId}`}
              className={`chat ${message.senderId === userId ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-bubble bg-primary text-white">
                {message.text}
                <div className="text-xs opacity-50 mt-1">
                  {message.timeStamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        isAudioOnly ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-4">🎤 Audio Call in Progress</div>
              <button 
                className="btn btn-error" 
                onClick={endCall}
              >
                End Call
              </button>
            </div>
          </div>
        ) : (
          <VideoFrame 
            endVideoCall={endCall} 
            localVideoRef={localVideoRef} 
            remoteVideoRef={remoteVideoRef} 
          />
        )
      )}

      {!onCall && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
