import { Router } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize } from "../middlewares/auth";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", getProducts);

router.post(
  "/add",
  authenticate,
  authorize(["admin", "supplier"]),
  [
    body("name")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Nama produk minimal 3 karakter"),
    body("price")
      .isNumeric()
      .custom((value) => value >= 0)
      .withMessage("Harga tidak boleh negatif"),
  ],
  validate,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize(["admin", "supplier"]),
  [
    body("name")
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage("Nama produk minimal 3 karakter"),
    body("price")
      .optional()
      .isNumeric()
      .custom((value) => value >= 0)
      .withMessage("Harga tidak boleh negatif"),
  ],
  validate,
  updateProduct
);

router.delete("/:id", authenticate, authorize(["admin", "supplier"]), deleteProduct);

export default router;
