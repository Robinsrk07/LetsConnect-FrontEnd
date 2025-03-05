import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useChatData } from "../hooks/userChatData"; // your custom hook for fetching chat data
import socket from "../Components/utils/socket"; // singleton socket instance

const Chat = () => {
  const { toUserId } = useParams();
  const [inputMessage, setInputMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?.userId;
  const { messages, endUserData, loading, error,setMessages } = useChatData(userId, toUserId);

  //console.log(messages)

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = {
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
        senderId: user.userId,
      };

      setMessages((prevMessages)=>[...prevMessages,newMessage])
      setInputMessage("");
      socket.emit("sendMessage", { newMessage, toUserId, userId });
    }
  };
// In your Chat component, inside a useEffect:
    useEffect(() => {
      if (userId && toUserId) {
        socket.emit("joinRoom", { userId, toUserId });
      }
    }, [userId, toUserId]);

  useEffect(() => {
    const handleReceiveMessage = ({ msg }) => {
      console.log("Message received from server:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [setMessages]);





  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading chat...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading chat: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          {endUserData && (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-700">
                  {endUserData.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {endUserData.name}
                </h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) &&
          messages.map((message) => (
            <div
              key={`${message.timeStamp}-${message.senderId}`}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timeStamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 shadow-md">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="btn btn-primary rounded-full px-6"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
