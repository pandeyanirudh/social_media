import postModel from "../models/post.model.js";

export async function createPost(req, res){
    try{
        const {userId, description, image} = req.body;

        if(!userId || !description){
            return res.status(400).json({
                message: "UserId and Description are required",
                err: true,
                success: false
            })
        }

        const newPost = new postModel({
            userId,
            description,
            image,
            likes:[]
        })

        await newPost.save();

        return res.status(200).json({
            message: "Post Created Successfully",
            success: true,
            err: false
        })
    } catch(err){
        return res.status(500).json({
            message: err.true || err,
            err: true,
            success: false
        })
    }
}