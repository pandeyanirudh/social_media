import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"

export async function logoutController(req, res){
    try{

        //derive userId from refreshToken cookie or request body fallback
        const { refreshToken } = req.cookies || {}
        let userId = req.body?.userId
        if(refreshToken){
            try{
                const decode = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
                userId = decode?.id || userId
            }catch(e){
                // invalid/expired token; fall back to provided body userId if any
            }
        }
         if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
                err: true,
                success: false
            })
         }

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        // at the time of logout we have to remove this token
        res.clearCookie("accessToken", cookieOption)
        res.clearCookie("refreshToken", cookieOption)

        // with the help of above userId we are going to identify the user to logout
        const removeRefreshToken = await userModel.findByIdAndUpdate(userId,
            {
            refresh_token: ""
        })
        if(!removeRefreshToken){
            return res.status(404).json({
                message: "User not found",
                err: true,
                success: false
            })
        }

        return res.status(200).json({
            message: "Logout Successfully",
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