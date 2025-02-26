import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, clearChat } = useChatStore();
    const { onlineUsers } = useAuthStore();
    
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false); // ✅ Loading state

    // Handle chat clearing
    const handleClearChat = async () => {
        if (!selectedUser) return;

        setIsClearing(true);
        try {
            await clearChat(selectedUser._id);
            toast.success("Chat cleared successfully!");
        } catch (error) {
            toast.error("Failed to clear chat.");
        } finally {
            setIsClearing(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="p-2.5 border-b border-base-300 relative">
            <div className="flex items-center justify-between">
                {/** User Info */}
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-10 rounded-full">
                            <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.fullName} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium">{selectedUser?.fullName || "Unknown User"}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/** Action Buttons */}
                <div className="flex gap-2">
                    <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-gray-200 transition">
                        <X className="w-5 h-5" />
                    </button>

                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-gray-200 transition">
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {/** Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-2 top-12 bg-white border shadow-md rounded-lg p-2 z-10">
                            <button
                                className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                    setShowConfirm(true);
                                    setShowMenu(false);
                                }}
                            >
                                Clear Chat
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/** Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Are you sure you want to clear the chat?</h3>
                        <div className="flex justify-end gap-3">
                            <button 
                                className="px-4 py-2 bg-gray-300 rounded-md" 
                                onClick={() => setShowConfirm(false)}
                                disabled={isClearing}
                            >
                                Cancel
                            </button>
                            <button 
                                className={`px-4 py-2 text-white rounded-md ${isClearing ? "bg-gray-400" : "bg-red-500"}`}
                                onClick={handleClearChat}
                                disabled={isClearing}
                            >
                                {isClearing ? "Clearing..." : "Yes, Clear"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatHeader;
