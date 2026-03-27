import { Router } from "express";
import { transferPoints, userPoints } from "../controllers/transferPointControllers";
import express from "express";

const router = express.Router()

router.post('/transfer-points', transferPoints);
router.get('/user-points/:id', userPoints);

export default router;