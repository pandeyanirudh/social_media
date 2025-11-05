import postModel from "../models/post.model.js";

export async function likeAndUnlikePost(req, res){
    try{
        const {postId} = req.body;
        const {userId} = req.body;

        const post = await postModel.findById(postId);
        if(!post){
            return res.status(403).json({
                message: "Post not found",
                err: true,
                success: false
            })
        }

        const alreadyLiked = post.likes.includes(userId);
        if(alreadyLiked){
            post.likes = post.likes.filter((id)=>id.toString() !== userId);
            await post.save();

            return res.status(200).json({
                message: "Post unlike successfully",
                err: false,
                success: true,
                data: post
            })
        } else{
            post.likes.push(userId);
            await post.save();

            return res.status(200).json({
                message: "Post liked successfully",
                err: false,
                success: true,
                data: post
            })
        }
} catch(err){
    return res.status(500).json({
        message: err.message || err,
        err: true,
        success: false
    })
}
}