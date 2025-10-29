import bcryptjs from 'bcryptjs'
import userModel from '../models/user.model.js';

export async function registerController(req, res){
try {
        const {firstName, lastName, userId, mobileNo, dateOfBirth, password, email} = req.body;

    if(!firstName || !lastName || !userId || !mobileNo || !dateOfBirth || !password || !email){
        return res.status(500).json({
            message: "Please provide all the mandatory details",
            err: true,
            success: false
        })
    }

    const userAlreadyPresent = await userModel.findOne({email});
    if(userAlreadyPresent){
        return res.status(409).json({
            message: "Email already registered with another account",
            err: true,
            success: false
        })
    }

    const salt = await bcryptjs.genSalt(8);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
        firstName,
        lastName,
        email,
        mobileNo,
        userId,
        dateOfBirth,
        password: hashPassword
    }

    const newUser = new userModel(payload)
    const save = await newUser.save()

    return res.status(200).json({
        message: "User Register Successfully",
        err: false,
        success: true,
        data: save
    })

} catch(err){
    return res.status(400).json({
        message: err.message || err,
        err: true,
        success: false
    })
}
}