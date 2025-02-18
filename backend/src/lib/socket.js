import {Server} from 'socket.io'
import express from 'express'
import http from "http"

const app=express();
const server=http.createServer(app);


const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
})
export function getreceiverSocketId(userId){
    return userSocketMap[userId];
}
//used to store online user that once a user is connected with the socket and its online the server needs to send a event to client that makes other 
//know that this particular user is online just like how we get to know if a person is online or not like that similarly using socketio its possible to know 
const userSocketMap={}; //{user:socketId} where the user is from the database and the socket id is from this socket.id
io.on("connection",(socket)=>{
    console.log("A user is Connected",socket.id);
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId]= socket.id;

    //broadcasts to every single user that is connected that these users are connected
    //io.emit() is used to send the event to all the connected clients in online while using the chat application
    io.emit("getOnlineUsers", Object.keys(userSocketMap));//which is the userId that is connected and that will be emitted to all other users connected online
    
    socket.on("disconnect",()=>{
        console.log("A user is disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})
export {io,app,server}