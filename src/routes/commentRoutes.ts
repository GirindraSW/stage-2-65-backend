import { Router } from "express";
import { getCommentsByPost } from "../controllers/commentController";

const router = Router();

router.get("/:id/comments", getCommentsByPost);

export default router;
