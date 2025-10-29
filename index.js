import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import databaseConnectivity from './config/database.connect.js'
import userRoute from './routers/user.router.js';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoute);

const port = process.env.PORT || 1234;

databaseConnectivity.then(()=>{
 app.listen(port, ()=>{
    console.log("Listening on port", port)
})
})