import express from "express"
import {signup,login,logout,updateProfile,checkAuth} from "../controllers/auth.contoller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router= express.Router();

//when we visit login or logout or sign in page we would like to call this router

//inorder to send the user details to the database which is mongodb the routers should be in post request instead of get to send the user details to 
//the database
router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);
//toupdate profile the request is put or too update anything generally the request given is put
router.put("/update-profile",protectRoute,updateProfile);
//check if the user is autheticated or not 
router.get('/check',protectRoute,checkAuth);
export default router;