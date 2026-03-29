import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authControllers";
import { authenticate, authorize } from "../middlewares/auth";
import { body } from "express-validator";

const router = Router();

// Validasi register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Nama wajib diisi"),
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
    body("role")
      .optional()
      .isIn(["admin", "user"])
      .withMessage("Role harus admin atau user"),
  ],
  register
);

// Validasi login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("password").notEmpty().withMessage("Password wajib diisi"),
  ],
  login
);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Format email tidak valid")],
  forgotPassword
);

router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token wajib diisi"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],
  resetPassword
);

// Protected admin-only route
router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Halo Admin!", user: req.user });
});

export default router;


// router.post("/products", authenticate, product Controller)
