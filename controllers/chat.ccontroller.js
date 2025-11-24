import chatModel from "../models/chat.model.js";

export async function createChat(req, res){
    try{
        const {receiverId} = req.body;
        const senderId = req.user._id;

        if(!user){
            return res.status(400).json({
                err: true,
                success: false,
                message: "ReceiversId is required"
            })
        }
        const existing = await chatModel.findOne({
            isGroupChat: false,
            members: {$all: [senderId, receiverId]}
        })

        if(existing){
            return res.status(200).json({
                err: false,
                success: false,
                chat: existing
            })
        }

        const chat = await chatModel.create({
            members: [senderId, receiverId]
        })

        return res.status(201).json({
            err: false,
            success: true,
            chat
        })
    } catch(err){
        return res.status(500).json({
            err: true,
            success: false,
            message: "Internal Server Error"
        })
    }
}

export async function userChat(req, res){
    try{
        const chats = await chatModel.find({
            members:{$in: [req.user._id]}
        }).populate("members", "name profile pic").sort({$updateAt: -1})

        return res.status(200).json({
            success: true,
            err: false,
            chats
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: err.message || err
        })
    }
}