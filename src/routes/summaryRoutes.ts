import { Router } from "express";
import { getCommentSummary } from "../controllers/commentSummaryController";

const router = Router();

router.get("/posts/comments-summary", getCommentSummary);

export default router;
