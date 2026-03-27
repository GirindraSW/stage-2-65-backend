import { Router } from "express";
import { updateStocks } from "../controllers/stockController";

const router = Router();

// Endpoint: POST /suppliers/stock
router.post("/suppliers/stock", updateStocks);

export default router;
