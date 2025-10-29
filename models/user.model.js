import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    profilePhoto: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
        default: "ACTIVE"
    },
    deleteAt:{
        type: Date,
    }
},{
    timestamps: true
})

const userModel = mongoose.model("user", userSchema);
export default userModel;