import postModel from "../models/post.model.js";

export async function deletePost(req, res){
    try{
        const {postId} = req.body;
        const {userId} = req.body;

        const post = await postModel.findById(postId);
        if(!post){
            return res.status(400).json({
                message: "Post not found",
                err: true,
                success: false
            })
        }

        // only owner can delete
        if(post.userId.toString() !== userId){
            return res.status(403).json({
                message: "Only woner can delet this post",
                err: true,
                success: false
            })
        }

        await postModel.findByIdAndDelete(postId);

        return res.status(200).json({
            message: "Post deleted successfully",
            err: true,
            success: false
        })
    } catch(err){
        return res.status(500).json({
            message: err.message || err,
            success: false,
            err: true
        })
    }
}