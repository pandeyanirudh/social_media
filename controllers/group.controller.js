import chatModel from "../models/chat.model.js";

export async function createGroup(req, res){
    try{
        const {chatName, members} = req.body; // members ayyay of userIds (excluding createor) or include them
        if(!chatName || !members){
            return res.status(400).json({
                err: true,
                success: false,
                message: "Chat name and Members are required"
            })
        }

        // ensure atleast 2 other members exclude creator
        const uniqueMembers = Array.from(new Set(members.map(String)));
        if(uniqueMembers.length<2){
            return res.status(400).json({
                err: true,
                success: false,
                message: "Group requires at least 3 members including you"
            })
        }

        const group = await chatModel.create({
            isGroupChat: true,
            chatName,
            members: [...uniqueMembers, req.user._id],
            admin: req.user._id
        })

        const populated = await chatModel.findById(group._id).populate("members", "name profilePic").populate("admin", "name profilePic");
        return res.status(201).json({
            success: true,
            err: false,
            group: populated
        })
    } catch (err){
        return res.status(500).json({
            success: false,
            message: err || err.message
        })
    }
}

export async function renameGroup(req, res){
    try{
        const {chatId, name} = req.body;
        if(!chatId || !name){
            return res.status(400).json({
                success: false,
                err: true,
                message: "chatId and name required"
            })
        }

        const updated = await chatModel.findByIdAndUpdate(chatId, {chatName: name}, {new: true}).populate("members", "name profilepic");
        return res.status(200).json({
            success: true,
            err: false,
            group: updated
        })
    } catch(err){
        return res.status(500).json({
            err: true,
            success: false,
            message: err || err.message
        })
    }
}

export async function addMember(req, res){
    try{
        const {chatId, userId} = req.body;
        if(!chatId || !userId){
            return res.status(400).json({
                success: false,
                err: Router,
                message: "chatId and userId required"
            })
        }

        const updated = await chatModel.findByIdAndUpdate(chatId, {$addToSet: {members: userId}}, {new: true}).populate("members", "name profilePic");
        return res.status(200).json({
            success: true,
            err: false,
            group: updated
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            err: true,
            message: err || err.message
        })
    }
}

export async function removeMember(req, res){
    try{
        const {chatId, userId} = req.body;
        if(!chatId || !userId){
            return res.status(400).json({
                err: true,
                success: false,
                message: "chatId and userId required"
            })
        }

        const updated = await chatModel.findByIdAndUpdate(chatId, {$pull: {members: userId}}, {new: true}).populate("members", "name profilePic");
        return res.status(200).json({
            success: true,
            err: false,
            group: updated
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            err: true,
            message: err || err.message
        })
    }
}

export async function leaveGroup(req, res){
    try{
        const {chatId} = req.params;
        if(!chatId){
            return res.status(400).json({
                success: false,
                message: "chatId required"
            })
        }

        const updated = await chatModel.findByIdAndUpdate(chatId, {$pull:{members: req.user._id}},{new: true}).populate("members", "name profilePic");
        return res.status(200).json({
            err: false,
            success: true,
            group: updated
        })
    } catch(err){
        return res.status(500).json({
            err: true,
            success: false,
            message: err || err.message
        })
    }
}