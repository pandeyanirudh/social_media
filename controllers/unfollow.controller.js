import userModel from "../models/user.model.js";

export async function unfollowUser(req, res){
    try{
        const userId = req.body.userId || req.body.id;
        const currentUserId = req.user?._id || req.body.currentUserId;

        const userToUnfollow = await userModel.findById(userId);
        const currentUser = await userModel.findById(currentUserId);

        if(!userToUnfollow || !currentUser){
            return res.status(404).json({
                message: "User not found",
                err: true,
                success: false
            })
        }

        if(!userToUnfollow.followers.includes(currentUserId)){
            return res.status.json({
                message: "You are not following this user",
                err: true,
                success: false
            })
        }

        userToUnfollow.followers.pull(currentUserId);
        currentUser.following.pull(userId);

        await userToUnfollow.save();
        await currentUser.save();

        return res.status(200).json({
            message: "User Unfollowed Successfully",
            err: false,
            success: true
        })
    } catch(err){
        return res.status(500).json({
            message: err.message || err,
            err: true,
            success: false
        })
    }
}