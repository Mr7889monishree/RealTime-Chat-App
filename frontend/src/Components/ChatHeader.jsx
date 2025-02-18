import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { X, MoreVertical } from 'lucide-react';

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, clearChat } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className='p-2.5 border-b border-base-300'>
            <div className='flex items-center justify-between relative'>
                <div className='flex items-center gap-3'>
                    {/** Avatar */}
                    <div className='avatar'>
                        <div className='size-10 rounded-full relative'>
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>
                    {/** User Info */}
                    <div>
                        <h3 className='font-medium'>{selectedUser.fullName}</h3>
                        <p className='text-sm text-base-content/70'>
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/** Close & More Options Button */}
                <div className="flex gap-2">
                    <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-gray-200 transition">
                        <X className='w-5 h-5' />
                    </button>

                    {/** More Options Button */}
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-gray-200 transition">
                        <MoreVertical className='w-5 h-5' />
                    </button>

                    {/** Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-2 top-12 bg-white border shadow-md rounded-lg p-2">
                            <button 
                                className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                    setShowConfirm(true);
                                    setShowMenu(false); // Close the menu after clicking
                                }}
                            >
                                Clear Chat
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/** Confirmation Modal with Transparent Background */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-base-800 backdrop-blur-sm">
                    <div className="bg-white p-5 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Are you sure you want to clear the chat?</h3>
                        <div className="flex justify-end gap-3">
                            <button 
                                className="px-4 py-2 bg-gray-300 rounded-md" 
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                                onClick={() => {
                                    clearChat(selectedUser._id);
                                    setShowConfirm(false);
                                }}
                            >
                                Yes, Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatHeader;
