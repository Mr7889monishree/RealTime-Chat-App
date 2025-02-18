import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeletonComponent from "./Skeleton/SidebarSkeletonComponent";
import { Plus } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, unreadMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showUsersOnline, setShowUsersOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on search and online status
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!showUsersOnline || onlineUsers.includes(user._id))
  );

  if (isUsersLoading) return <SidebarSkeletonComponent />;

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5 flex justify-between items-center">
          <span className="font-medium hidden lg:block">Contacts</span>
          
          {/** ✅ Plus button for future group creation (currently inactive) **/}
          <button
            onClick={(event) => {
              event.stopPropagation(); 
              // setShowGroupModal(true); // ❌ Group creation disabled
            }}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled // ❌ Temporarily disable group creation button
          >
            <Plus className="size-5" />
          </button>
        </div>

        {/** ✅ Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/** ✅ Users List */}
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300
              transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img src={user.profilePic || "/avatar.png"} alt={user.name} className="size-12 object-cover rounded-full" />
                {/** ✅ Show online status indicator */}
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-1 ring-zinc-600" />
                )}
              </div>
              <div className="hidden lg:block text-left min-w-0  justify-between w-full">
                <div>
                  <div className="font-medium truncate">{user.fullName}</div>
                  <div className="text-sm text-zinc-400">{onlineUsers.includes(user._id) ? "Online" : "Offline"}</div>
                </div>
                {/** ✅ Unread Message Badge */}
                {unreadMessages[user._id] && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    {unreadMessages[user._id] > 1 ? `${unreadMessages[user._id]}+` : "1"}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
