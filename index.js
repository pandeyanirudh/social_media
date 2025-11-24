import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import databaseConnectivity from './config/database.connect.js'
import userRoute from './routers/user.router.js';
import cookieParser from 'cookie-parser';
import chatRoute from './routers/chat.router.js';
import cors from "cors"

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CORS_ORIGIN || "*"}));

app.use('/api', userRoute);
app.use('/api', chatRoute);

// chech health
app.get("/api/health", (req, res) => res.json({ok: true}));

// create http and socket server
const server = http.createServer(app);
const io = new IOServer(server, {
    cors: {origin: process.env.CORS_ORIGIN || "*", methods: ["GET", "POST"]},
    pingTimeout: 60000
});

// attach socket handler
attachSocket(io);

// make io available to controller if needed
app.set("io", io)

const port = process.env.PORT || 1234;

databaseConnectivity.then(()=>{
 app.listen(port, ()=>{
    console.log("Listening on port", port)
})
})