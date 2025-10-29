import userModel from "../models/user.model.js"

export async function deleteUser(req, res){
    try{
     const userId = req.body._id;

     if(!userId){
        return res.status.json({
            message: "user id not found",
            err: true,
            success: false
        })
     }

     const user = await userModel.findById(userId)
     if(!user){
        return res.status(400).json({
            message: "user not found",
            err: true,
            success: false
        })
     }

     // both are correct
    //  await userModel.findByIdAndDelete(userId);
    await user.deleteOne();

     return res.status(200).json({
        message: "User deleted successfully",
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

