import { Router } from "express";
import { jwtauthMiddleware } from "../auth/jwt.auth.middleware.js";
import { createChat, userChat } from "../controllers/chat.ccontroller.js";
import { getMessage, sendMessageREST } from "../controllers/message.controller.js";
import { addMember, createGroup, leaveGroup, removeMember, renameGroup } from "../controllers/group.controller.js";


const chatRoute = Router();

// chat routes
chatRoute.post("/createChat", jwtauthMiddleware, createChat);
chatRoute.get("/getChat", jwtauthMiddleware, userChat);

// message routes
chatRoute.post("/sendMessage", jwtauthMiddleware, sendMessageREST);
chatRoute.get("/:chatId", jwtauthMiddleware, getMessage);

// groupchat routes
chatRoute.post("/createGroup", jwtauthMiddleware, createGroup);
chatRoute.put("/renameGroup", jwtauthMiddleware, renameGroup);
chatRoute.put("/addMember", jwtauthMiddleware, addMember);
chatRoute.put("/removeMember", jwtauthMiddleware, removeMember);
chatRoute.put("/leaveGroup", jwtauthMiddleware, leaveGroup);

export default chatRoute;