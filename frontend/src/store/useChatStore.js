import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  unreadMessages: {}, // ✅ Store unread messages count per user
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");

      // Sort users by last message timestamp (most recent first)
      const sortedUsers = res.data.sort((a, b) => 
        new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
      );

      set({ users: sortedUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      // ✅ Mark messages as read for this user
      get().markMessagesAsRead(userId);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });

      // ✅ Reset unread count for the selected user
      get().markMessagesAsRead(selectedUser._id);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set((state) => {
        const unread = { ...state.unreadMessages };

        if (!state.selectedUser || state.selectedUser._id !== newMessage.senderId) {
          // ✅ Increment unread messages if chat is not open
          unread[newMessage.senderId] = (unread[newMessage.senderId] || 0) + 1;
        }

        return {
          messages: [...state.messages, newMessage],
          unreadMessages: unread,
        };
      });
    });
  },

  unSubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  markMessagesAsRead: (userId) => {
    set((state) => {
      const unread = { ...state.unreadMessages };
      delete unread[userId]; // ✅ Remove unread count
      return { unreadMessages: unread };
    });
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    if (selectedUser) {
      get().markMessagesAsRead(selectedUser._id); // ✅ Mark messages as read when user is clicked
    }
  },
  clearChat: async (userId) => {
    try {
        await axiosInstance.delete(`/messages/clear/${userId}`);

        set((state) => ({
            messages: state.messages.filter(
                (msg) => msg.senderId !== userId && msg.receiverId !== userId
            ),
        }));

        toast.success("Chat cleared successfully!");
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to clear chat.");
    }
},

}));

