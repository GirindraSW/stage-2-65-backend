import { Request, Response } from "express";
import prisma from "../../prisma/client";

const parseIdParam = (idParam: string | string[] | undefined): number => {
  const value = Array.isArray(idParam) ? idParam[0] : idParam;
  return Number(value);
};

export const getProducts = async (req: Request, res: Response) => {
  const { sortBy, order, minPrice, maxPrice, limit, offset } = req.query;

  const filters: any = {};
  if (minPrice) filters.price = { gte: parseFloat(minPrice as string) };
  if (maxPrice) {
    filters.price = {
      ...(filters.price || {}),
      lte: parseFloat(maxPrice as string),
    };
  }

  const sortField = typeof sortBy === "string" ? sortBy : "id";
  const sortOrder = order === "desc" ? "desc" : "asc";

  try {
    const products = await prisma.product.findMany({
      where: filters,
      orderBy: { [sortField]: sortOrder },
      take: limit ? Number(limit) : undefined,
      skip: offset ? Number(offset) : undefined,
    });

    const total = await prisma.product.count({ where: filters });
    res.json({ data: products, total });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, initialStock } = req.body;

  try {
    const product = await prisma.product.create({
      data: { name, price: Number(price) },
    });

    if (req.user?.role === "supplier" && initialStock !== undefined) {
      await prisma.stock.create({
        data: {
          productId: product.id,
          supplierId: req.user.id,
          quantity: Number(initialStock),
        },
      });
    }

    res.status(201).json({ message: "Produk berhasil dibuat", product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id);
  const { name, price } = req.body;

  try {
    if (req.user?.role === "supplier") {
      const ownership = await prisma.stock.findUnique({
        where: {
          productId_supplierId: {
            productId: id,
            supplierId: req.user.id,
          },
        },
      });
      if (!ownership) {
        return res.status(403).json({ error: "Tidak memiliki akses ke produk ini" });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
      },
    });

    res.json({ message: "Produk berhasil diupdate", product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id);

  try {
    if (req.user?.role === "supplier") {
      const ownership = await prisma.stock.findUnique({
        where: {
          productId_supplierId: {
            productId: id,
            supplierId: req.user.id,
          },
        },
      });
      if (!ownership) {
        return res.status(403).json({ error: "Tidak memiliki akses ke produk ini" });
      }
    }

    await prisma.stock.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    res.json({ message: "Produk berhasil dihapus" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};