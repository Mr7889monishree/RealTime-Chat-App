import jwt from "jsonwebtoken"
export const generateToken=(userId,res)=>{
    const token= jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,//MS
        httpOnly:true, //prevent XSS attack from the cross-scripting attacks
        sameSite:"strict",//CFRS attack prevention
        secure: process.env.NODE_URL != "developement"

    })
    return token;
}