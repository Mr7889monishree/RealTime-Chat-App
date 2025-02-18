import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeletonComponent from './Skeleton/MessageSkeletonComponent';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
const ChatContainer = () => {
  const {messages,getMessages,ismessagesLoading,selectedUser,subscribeToMessages,unSubscribeFromMessage}=useChatStore();
  //useeffect should run without any conditions so putting it above the if else statement
  const {authUser}=useAuthStore();
  const messageEndref=useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    //whenever the selected user id changes we will run the useeffect
    subscribeToMessages();

    return () => unSubscribeFromMessage();
  }, [selectedUser._id,getMessages,subscribeToMessages,unSubscribeFromMessage]);
  //just to make that scroll smooth when i leave text instead of the user scorlling it
  useEffect(()=>{
    //tomake this work without any issue that only when there is messages this will be called
    if(messageEndref.current && messages){
      messageEndref.current.scrollIntoView({behavior:"smooth"});
    }
  },[messages])
  if(ismessagesLoading) {return(
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeletonComponent />
      <MessageInput/>
    </div>
  )}
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <div className='flex-1 overfloe-y-auto p-4 space-y-4'>
        {messages.map((message)=>(
          <div
          key={message._id}
          className={`chat ${message.senderId  === authUser._id ? "chat-end":"chat-start"}`}
          ref={messageEndref}>
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId===authUser._id ? authUser.profilePic ||"/avatar.png" : selectedUser.profilePic} 
                alt="profile pic" />
              </div>
            </div>
            <div className=' chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img
                src={message.image}
                alt="Attachment"
                className='sm:max-w-[200px] rounded-md mb-2'
                  />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer