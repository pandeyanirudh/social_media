// /config/socket.js
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
import messageModel from "../model/message.model.js";
import chatModel from "../model/chat.model.js";

/**
 * attachSocket(io)
 */
export default function attachSocket(io) {
  // userId => Set(socketId)
  const onlineUsers = new Map();

  // socket middleware: verify token
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Authentication error: No token"));

      const cleaned = token.replace("Bearer ", "");
      const decoded = jwt.verify(cleaned, process.env.SECRET_KEY_ACCESS_TOKEN);
      if (!decoded?.id) return next(new Error("Authentication error: Invalid token"));

      const user = await userModel.findById(decoded.id).select("-password");
      if (!user) return next(new Error("Authentication error: User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log("Socket connected:", userId, socket.id);

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    // personal room for notifications across devices
    socket.join(`user_${userId}`);

    // broadcast presence change (optional)
    io.emit("user-online", { userId, online: true });

    // join any chat room (client will call after connecting)
    socket.on("join-chat", async ({ chatId }) => {
      if (!chatId) return;
      // Validate membership optionally
      const chat = await chatModel.findById(chatId);
      if (!chat) return;
      if (!chat.members.map(m => m.toString()).includes(userId)) return;
      socket.join(`chat_${chatId}`);
    });

    socket.on("typing", ({ chatId }) => {
      if (!chatId) return;
      socket.to(`chat_${chatId}`).emit("typing", { chatId, userId });
    });

    socket.on("stop-typing", ({ chatId }) => {
      if (!chatId) return;
      socket.to(`chat_${chatId}`).emit("stop-typing", { chatId, userId });
    });

    // new-message event for both private and group chats
    socket.on("new-message", async (payload, ack) => {
      try {
        const { chatId, text } = payload;
        if (!chatId || !text) return ack?.({ success: false, message: "chatId and text required" });

        const chat = await chatModel.findById(chatId);
        if (!chat || !chat.members.map(m => m.toString()).includes(userId)) {
          return ack?.({ success: false, message: "Not a member of chat" });
        }

        const saved = await messageModel.create({ chatId, senderId: userId, text });
        const populated = await messageModel.findById(saved._id).populate("senderId", "name profilePic");

        // emit to chat room
        io.to(`chat_${chatId}`).emit("message-received", { message: populated });

        // emit notification to each member personal room
        chat.members.forEach(m => {
          io.to(`user_${m.toString()}`).emit("new-message-notification", {
            chatId,
            message: populated
          });
        });

        ack?.({ success: true, message: populated });
      } catch (err) {
        console.error("socket new-message error", err);
        ack?.({ success: false, message: err.message });
      }
    });

    socket.on("message-seen", async ({ chatId, messageIds }) => {
      try {
        if (Array.isArray(messageIds) && messageIds.length) {
          // optional DB update if you'd like to persist seenBy
          await messageModel.updateMany(
            { _id: { $in: messageIds } },
            { $addToSet: { seenBy: userId } }
          );
        }
        io.to(`chat_${chatId}`).emit("message-seen", { chatId, messageIds, userId });
      } catch (err) {
        console.error("message-seen error", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id, userId);
      if (onlineUsers.has(userId)) {
        const s = onlineUsers.get(userId);
        s.delete(socket.id);
        if (s.size === 0) {
          onlineUsers.delete(userId);
          io.emit("user-online", { userId, online: false });
        } else {
          onlineUsers.set(userId, s);
        }
      }
    });
  });
}
