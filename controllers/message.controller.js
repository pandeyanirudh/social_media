import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";

export async function sendMessageREST(req, res){
    try{
        const {chatId, text} = req.body;
        if(!chat || !text){
            return res.status(400).json({
                success: false,
                err: true,
                message: "chatId and text required"
            })
        }

        // membership check
        const chat = await chatModel.findById(chatId);
        if(!chat || !chat.member.map(m => m.toString()).includes(req.user._id.toString())){
            return res.status(201).json({
                success: true,
                err: false,
                message: "Not a member of this chat"
            })
        }

        const messages = await messageModel.create({ chatId, senderId: req.user._id, text})
        // optionally populate senedr an dreturn
        const populated = await messageModel.findById(messages._id).populate("senderId", "name profilePic")
        return res.status(201).json({
            success: true,
            err: false,
            message: populated
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            err: true,
            message: err || err.message
        })
    }
}

export async function getMessage(req, res){
    try{
        const {chatId} = req.params;
        if(!chatId){
            return res.status(400).json({
                success: false,
                err: true,
                message: "chatId is required"
            })
        }

        const messages = await messageModel.find({chatId}).populate("senderId", "name profilePic").sort({createdAt: 1})
        return res.status(200).json({
            success: true,
            err: false,
            messages
        })
    } catch(err){
        return res.status(500).json({
            err: true,
            success: false,
            message: err || err.message
        })
    }
}