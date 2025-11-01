import userModel from "../models/user.model.js"

// export async function deleteUser(req, res){
//     try{
//      const userId = req.body._id;

//      if(!userId){
//         return res.status.json({
//             message: "user id not found",
//             err: true,
//             success: false
//         })
//      }

//      const user = await userModel.findById(userId)
//      if(!user){
//         return res.status(400).json({
//             message: "user not found",
//             err: true,
//             success: false
//         })
//      }

//      // both are correct
//     //  await userModel.findByIdAndDelete(userId);
//     await user.deleteOne();

//      return res.status(200).json({
//         message: "User deleted successfully",
//         err: false,
//         success: true
//      })

//     } catch(err){
//         return res.status(500).json({
//             message: err.message || err,
//             err: true,
//             success: false
//         })
//     }

// }

export async function deleteUser(req, res){
    try{
        const userId = req.body._id;

        if(!userId){
            return res.status(400).json({
                message: "USerID not found",
                err: true,
                success: false
            })
        }8

        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                err: true,
                success: false
            })
        }

        if(user.status === "DELETED"){
            return res.status(400).json({
                message: "Account not found",
                err: true,
                success: false
            })
        }

        if(user.status === "INACTIVE"){
            // Permanent delete for inactive users
            user.status = "DELETED";
            user.inactiveSince = null; // Clear inactive since
            await user.save();

            return res.status(200).json({
                message: "User permanently deleted",
                err: false,
                success: true
            })
        }

        // Soft delete [Make the user as inactive]
        user.status = "INACTIVE";
        user.inactiveSince = new Date();
        await user.save();

        return res.status(200).json({
            message: "Your account will be deleted after 30 days",
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