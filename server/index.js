import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRoute from './routes/users.js';
import videoRoute from './routes/videos.js';
import authRoute from './routes/auth.js';
import commentRoute from './routes/comments.js';
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

//db connection
const connect = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to database");
}

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/videos", videoRoute);
app.use("/api/comments", commentRoute);
app.use((err,req,res,next) => {
const status = err.status || 500;
const message = err.message || "something went wrong";
return res.status(status).json({
    success: false,
    status,
    message
})
});

app.listen(8800, () => {
    connect();
    console.log("connected");
});
