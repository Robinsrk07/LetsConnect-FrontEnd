import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL_CHAT_SERVICE
export const fetchChatMessages = async (userId, toUserId) => {
  const chat = await axios.post(`${BASE_URL}/chat/chats`, { userId, toUserId }, { withCredentials: true });
  return chat.data;
};

export const fetchEndUser = async (toUserId) => {
  try {
    const toUser = await axios.get(`${BASE_URL}/chat/endUser`, {
      params: { toUserId },
      withCredentials: true,
    });
    return toUser.data;
  } catch (error) {
    console.error("Error fetching end user data:", error);
    throw error;
  }
};