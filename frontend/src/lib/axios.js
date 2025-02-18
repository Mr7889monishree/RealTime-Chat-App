 //instance that we can use throughout our application
 import axios from "axios";

 export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "developement" ? "http://localhost:5002/api" : "/api",
    withCredentials:true, //this is how we can send cookie in every request we send
 })
