import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'
import bcrypt from "bcryptjs"
import cloudinary from '../lib/cloudinary.js';
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields must be entered" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // Generate JWT token for authentication
            generateToken(newUser._id, res);

            await newUser.save();

            // Responding with newly created user details
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Failed to create new user" });
        }
    } catch (error) {
        console.log("Error in Signup Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isPasswordCorrect= await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,

        })
    }
     catch (error) {
        console.log("Error in Signup Controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
        
    }


};
export const logout=(req,res)=>{
    try {
        //to clear out the cookies
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged Out successfully"});
        
    } catch (error) {
        console.log("Error in Signup Controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
        
    }

};
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic is required" });
        }

        // Upload profile pic to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic); 

        // Update the user's profile picture in the database
        const updateUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: uploadResponse.secure_url },
            { new: true }  // This returns the updated user document
        );

        res.status(201).json(updateUser);
    } catch (error) {
        console.log("Error in Updating the profile", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


//one more function for the user authentication which is the get function
export const checkAuth=(req,res)=>{
    try {
        //send the user back to the client this will give you the authenticated user to check if its autheticated or not
        return res.status(200).send(req.user);
    } catch (error) {
        console.log("Error in CheckAuth Controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}