import cloudinary from "../lib/cloudinary.js";
import { getreceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js"
import User from "../models/user.model.js";
import {io} from "../lib/socket.js"
/* import Group from "../models/group.model.js"; // Import Group model
 */
export const getUserFromSideBar=async(req,res)=>{
    try {
        const loggedInUser= req.user._id;
        const filteredUsers=await User.find({id:{$ne:loggedInUser}}).select("-password");

        res.status(200).json(filteredUsers);
        
    } catch (error) {
        console.log("Error From GetUserFromSideBar",error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

//to get message from the user one of them will be us and other id who is chatting with us
export const getMessages=async(req,res)=>{
    try {
        const {id:UserToChatId}=req.params;
        const myId=req.user._id;
        //find all the messages whether im the sender or the other user is the sender
        const messages = await Message.find({
            //any way i need to fetch the messages from both the Id's and finds all the messages between the sender and receiver
            $or:[
                //if im the sender and the receiver is other id
                {senderId:myId,receiverId:UserToChatId},
                //or if the sender is other id and im the receiver
                {senderId:UserToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);
        
    } catch (error) {
        console.log("Error From GetMessages",error.message);
        return res.status(500).json({message:"Internal Server Error"});
        
    }
}
//endpoint to send messages

/* export const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId= req.user._id;

        let imageUrl;
        if(image){
            //upload base64 image to cloudinary
            const updateResponse=await cloudinary.uploader.upload(image);
            imageUrl=updateResponse.secure_url;
        }
        const newMessage= new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageUrl,
        });
        await newMessage.save();


        //todo:realtime functionality goes here which wil happen with the help of socket.io
        const receiverSocketId= getreceiverSocketId(receiverId);//here we get the socket id of the user
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error From SendMessage",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
} */
export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      if (!receiverId) {
        return res.status(400).json({ message: "Receiver ID is required." });
      }
  
      if (!text && !image) {
        return res.status(400).json({ message: "Message text or image is required." });
      }
  
      let imageUrl = null;
      if (image) {
        if (!image.startsWith("data:image")) {
          return res.status(400).json({ message: "Invalid image format." });
        }
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();
  
      // **UPDATE LAST MESSAGE TIMESTAMP IN USER MODEL**
      await User.findByIdAndUpdate(senderId, {
        $set: { lastMessageAt: new Date() },
      });
  
      await User.findByIdAndUpdate(receiverId, {
        $set: { lastMessageAt: new Date() },
      });
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("❌ Error From SendMessage:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
export const clearChat = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const myId = req.user._id;

        // Delete messages where senderId is me and receiverId is the selected user
        await Message.deleteMany({
            $or: [
                { senderId: myId, receiverId: userId },
                { senderId: userId, receiverId: myId }
            ]
        });

        res.status(200).json({ message: "Chat cleared successfully." });
    } catch (error) {
        console.error("Error clearing chat:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
/* export const createGroupChat = async (req, res) => {
    try {
        const { groupName, userIds } = req.body;

        if (!groupName || userIds.length < 2) {
            return res.status(400).json({ message: "Group must have a name and at least 2 users." });
        }

        const newGroup = new Group({
            name: groupName,
            members: userIds
        });

        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
 */