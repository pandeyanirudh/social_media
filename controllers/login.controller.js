import bcryptjs from "bcryptjs";
import userModel from "../models/user.model.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

export async function loginController(req, res){
    try{
        const {userId, password} = req.body

        // if userId and password is wrong
        if(!userId || !password){
            return res.status(400).json({
                message: "Please fill the correct details",
                err: true,
                success: false
            })
        }

        // if user already exists
        const user = await userModel.findOne({userId})
        if(!user){
            return res.status(400).json({
                message: "User not registered",
                err: true,
                success: false
            })
        }

        //comparison must be in uppercase or in lowercase
        if(user.status.toUpperCase()!=="ACTIVE"){
            return res.status(403).json({
                message: "contact to admin",
                err: true,
                success: false
            })
        }

        // compare the normal password with hash password
        const checkPassword = await bcryptjs.compare(password, user.password)

        // if password is incorrect send this message
        if(!checkPassword){
            return res.status(400).json({
                message: "Your password is incorrect",
                err: true,
                success: false
            })
        }

        // if password is correct so for login purpose we'll send the token to the client side
        // now we can generate the token
        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        // now we'll send token inside the cookie
        const cookieOption ={
            httpOnly: true,
            secure: true,
            sameSite: "None" // we use frontend and backend on different domain thats why we use here None
        }

        res.cookie('accessToken', accessToken, cookieOption)
        res.cookie('refreshToken', refreshToken, cookieOption)

        // sending response so that user login successfully
        return res.status(200).json({
            message: "Login Successfully",
            err: false,
            success: true
        })

    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            err: true,
            success: false
        })
    }
}