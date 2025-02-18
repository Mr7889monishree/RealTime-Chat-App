import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const protectRoute= async(req,res,next)=>{
    try {
        const token=await  req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized-No token Provided"});
        }

        //to grab the token from the cookies we are going use the cookie-parser packag here
        //  just decode the jwt token generated when signed up and get the user id out of it
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized-No token Provided"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        req.user=user;
        next();
    } catch (error) {
        console.log("Error in ProtectRoute Middleware",error.message);
        return res.status(500).json({message:"Internal Server Error"});
        
    }
}