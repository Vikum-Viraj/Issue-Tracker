import express from "express";
import { createIssue, updateIssue, getAllIssues, getIssueById } from "../controller/Issue-controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - require authentication
router.get("/", authMiddleware, getAllIssues);
router.get("/:id", authMiddleware, getIssueById);
router.post("/create", authMiddleware, createIssue);
router.put("/update/:id", authMiddleware, updateIssue);

export default router;
