import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserFromSideBar, getMessages, sendMessage, clearChat } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUserFromSideBar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/clear/:id", protectRoute, clearChat); // New route for clearing chat
/* router.post("/create-group", protectRoute, createGroupChat);
 */
export default router;
