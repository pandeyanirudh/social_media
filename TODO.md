# TODO List for Fixing User Delete and Reactivate Logic

- [x] Update `controllers/delete.controller.js` to allow deleting "INACTIVE" users by setting status to "DELETED" instead of returning an error.
- [x] Fix `controllers/reactivate.controller.js` to properly fetch the user by ID, check if status is "INACTIVE", verify within 30 days, and reactivate by setting status to "ACTIVE".











import userModel from "../models/user.model";

export async function reactivateUser(req, res){
    try{
        const {_id} = req.body;

        if(!_id){
            return res.status(400).json({
                message: "User ID not found",
                err: true,
                success: false
            })
        }

        const user = await userModel.findById(_id);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                err: true,
                success: false
            })
        }

        if(user.status !== "INACTIVE"){
            return res.status(400).json({
                message: "User is not inactive",
                err: true,
                success: false
            })
        }

        // Check within 30 days
        const inactiveDays = (Date.now() - new Date(user.inactiveSince))/(1000*60*60*24);
        if(inactiveDays > 30){
            return res.status(400).json({
                message: "Reactivation period expired",
                err: true,
                success: false
            })
        }

        // Reactivate user
        user.status = "ACTIVE";
        user.inactiveSince = null;
        await user.save();

        return res.status(200).json({
            message: "User reactivated successfully",
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
