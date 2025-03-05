import { useState, useEffect } from "react";
import { fetchChatMessages, fetchEndUser } from "../services/chatService";

export const useChatData = (userId, toUserId) => {
  const [messages, setMessages] = useState([]);
  const [endUserData, setEndUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !toUserId) return;

    const getData = async () => {
      try {
        const chatData = await fetchChatMessages(userId, toUserId);
        setMessages(chatData.messages || []);
        const endUser = await fetchEndUser(toUserId);
        setEndUserData(endUser);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [userId, toUserId]);

  return { messages,setMessages, endUserData, loading, error };
};