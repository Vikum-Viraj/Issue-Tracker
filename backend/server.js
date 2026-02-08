import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import  dotenv from 'dotenv' 
import issueRouter from "./routes/issue-route.js";
import userRouter from "./routes/user-route.js";

dotenv.config()

const app = express();

// CORS configuration to allow frontend deployments
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow any vercel.app domain for production
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    
    // Allow specific domains if needed
    return callback(null, true); // Allow all for now
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

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

