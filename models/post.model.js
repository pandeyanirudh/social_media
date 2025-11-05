import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        req: true
    }],
    description:{
        type: String,
        req: true
    },
    image:{
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
},{
    timestamps: true
})

const postModel = mongoose.model("post", postSchema);
export default postModel;
