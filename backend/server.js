import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import  dotenv from 'dotenv' 
import issueRouter from "./routes/issue-route.js";
import userRouter from "./routes/user-route.js";

dotenv.config()

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    'https://issue-tracker-p1m1.vercel.app',
    'https://issue-tracker.vercel.app'
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json())

// routes
app.use("/api/issues", issueRouter);
app.use("/api/users", userRouter);


mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
.then(() => app.listen(5000))
.then(() => console.log("Server running on port 5000"))
.then(() => console.log("Database is Connected"))
.catch((err) => console.log(err));

