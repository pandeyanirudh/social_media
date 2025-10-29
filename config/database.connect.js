import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

if (!process.env.MONGO_URI){
    throw new Error("Please provide MONGO_URI in .env file")
}

async function databaseConnectivity(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully");

    }catch(err){
        console.log("Database connection failed");
        process.exit(1);
    }

}

export default databaseConnectivity();