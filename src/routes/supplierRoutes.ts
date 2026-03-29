import { Router } from "express";
import { body } from "express-validator";
import { loginSupplier, getSupplierProducts } from "../controllers/supplierControllers";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("password").notEmpty().withMessage("Password wajib diisi"),
  ],
  loginSupplier
);

router.get("/products", authenticate, authorize(["supplier"]), getSupplierProducts);

export default router;
