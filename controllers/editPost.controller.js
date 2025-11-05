import postModel from "../models/post.model.js";

export async function editPost(req, res){
    try{
        const {postId} = req.params;
        const {userId, description, image} = req.body;

        const post = await postModel.findOne(postId);
        if(!post){
            return res.status(400).json({
                message: "Post not found",
                err: true,
                success: false
            })
        }

        // only the owner can edit the post
        if(post.userId.toString() !== userId){
            return res.status(403).json({
                message: "You can only edit your own post",
                err: true,
                success: false
            })
        }

        post.description = description || post.description;
        post.image = image || post.image;

        await post.save();

        return res.status(200).json({
            message: "Post updated successfully",
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