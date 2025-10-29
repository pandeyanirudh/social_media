import userModel from "../models/user.model.js"

export async function getUserController(req, res){
    try{
        const userId = req.body._id;

        if(!userId){
            return res.status(400).json({
                message: "User id is required",
                err: true,
                success: false
            })
        }

        // find user by Id, excluding password from response
        const user = await userModel.findById(userId).select("-password");

        if(!user){
            return res.status(400).json({
                message: "user not found",
                err: true,
                success: false
            })
        }

        return res.status(200).json({
            message: "User data fetched successfully",
            err: false,
            success: false,
            // this will get the data
            user
        })

    } catch(err){
        return res.status(500).json({
            message: err.message || err,
            err: true,
            success: false
        })
    }
}