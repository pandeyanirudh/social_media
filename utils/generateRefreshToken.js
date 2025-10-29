import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateRefreshToken = async(userId) => {
    const token = jwt.sign({id: userId}, process.env.SECRET_KEY_REFRESH_TOKEN, {expiresIn: '30d'})

    // Persist the latest refresh token against the user
    await userModel.updateOne({_id: userId}, {refresh_token: token})
    return token
}

export default generateRefreshToken