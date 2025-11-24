import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    isGroupChat:{
        type: Boolean,
        default: false
    },
    chatName:{
        type: String,
        trim: true
    },
    members:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
},{
    timestamps: true
})

const chatModel = mongoose.model("chat", chatSchema);
export default chatModel;