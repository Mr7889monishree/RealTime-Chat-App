import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import io from "socket.io-client"


const BASE_URL= import.meta.env.MODE === "developement"  ? "http://localhost:5002/" : "/";
export const useAuthStore = create((set,get) => ({
  authUser: null, // we don't know if the user is authenticated or not, we have to check for it
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // as soon as we refresh the page to check if the user is authenticated or not
  onlineUsers:[],
  socket:null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data }); // if the user is authenticated
      get().connectSocket();
    } catch (error) {
      console.log("Error in Authentication", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      if (res && res.data) {
        set({ authUser: res.data }); // so that the user will be authenticated as soon as they sign up
        toast.success("Account Created Successfully");
        get().connectSocket();

      } else {
        toast.error("Unexpected response format.");
      }
    } catch (error) {
      console.log(error); // Log the error for better debugging

      // Check if error.response and error.response.data exist before accessing them
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // to grab the message that we are sending from the signup page
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
  
    try {
      console.log("🔹 Login Attempt:", data); // Debugging log
  
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");
      get().connectSocket();
  
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  
  
  logout:async()=>{
    try {
        await axiosInstance.post('/auth/logout');
        set({authUser:null});
        toast.success("Logged Out Successfully!");
        get().disconnectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
        
    }
  },
  updateProfile:async(data)=>{
    set({isUpdatingProfile:true});
    try {
      const res=await axiosInstance.put("/auth/update-profile",data);
      set({authUser:res.data});
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log("Error in Update profile:",error);
      toast.error(error.response.data.message);      
    }
    finally{
      set({isUpdatingProfile:false});
    }
  },
  connectSocket:async()=>{
    const {authUser}=get();
    if(!authUser || get().socket?.connected) return;
    const socket=io(BASE_URL,{
      query:{
        userId:authUser._id,
      },
    });
    socket.connect();
    set({socket:socket})
    //online user array will be updated with the logged in user id and listen to the activities done by the user and store them and this user in online is stored intially inthe socket in server side 
    // and then now in this page it is made to be known to the client side too by storing them inside the online users array
    socket.on("getOnlineUsers",(userIds)=>{
      set({onlineUsers:userIds})

    })
  },
  disconnectSocket:async()=>{
    if(get().socket?.connected)  get().socket.disconnect();
  },
}));
