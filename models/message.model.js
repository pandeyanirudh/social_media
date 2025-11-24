import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
        req: true
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        req: true
    },
    text:{
        type: String,
        req: true,
    },
    seenBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},{
    timestamps: true
})

const messageModel = mongoose.model("message", messageSchema);
export default messageModel;