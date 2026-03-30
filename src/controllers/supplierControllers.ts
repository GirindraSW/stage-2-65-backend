import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

export const loginSupplier = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  try {
    const supplier = await prisma.supplier.findUnique({ where: { email } });
    if (!supplier) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const isMatch = await comparePassword(password, supplier.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const token = generateToken(supplier.id, supplier.role);
    res.cookie("supplier_token", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    res.json({
      message: "Login supplier berhasil",
      token,
      supplier: {
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        role: supplier.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logoutSupplier = async (_req: Request, res: Response) => {
  res.clearCookie("supplier_token");
  res.json({ message: "Logout supplier berhasil" });
};

export const getSupplierProducts = async (req: Request, res: Response) => {
  const supplierId = req.user?.id;

  if (!supplierId) {
    return res.status(401).json({ error: "Token tidak valid" });
  }

  try {
    const stocks = await prisma.stock.findMany({
      where: { supplierId },
      include: { product: true },
    });

    res.json({
      data: stocks.map((s) => ({
        product: s.product,
        quantity: s.quantity,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
