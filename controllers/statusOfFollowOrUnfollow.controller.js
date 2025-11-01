import userModel from "../models/user.model.js";

export async function checkFollowOrUnfollowStatus(req, res){
    try{
        const {targetUserId, currentUserId: bodyUserId} = req.body;
        const currentUserId = req.user?._id || bodyUserId;

        const targetUser = await userModel.findById(targetUserId);

        if(!targetUserId || !currentUserId){
            return res.status(400).json({
                message: "Both id must be required",
                err: true,
                success: false
            })
        }

        if(!targetUser){
            return res.status(404).json({
                message: "Target user not found",
                err: true,
                success: false
            })
        }

        const isFollowing = targetUser.followers.includes(currentUserId);

        return res.status(200).json({
            err: false,
            success: true,
            targetUser,
            message: isFollowing?"You are following this user":"You are not following this user"
        })
    } catch(err){
        return res.status(500).json({
            message: err.message || err,
            err: true,
            success: false
        })
    }
}