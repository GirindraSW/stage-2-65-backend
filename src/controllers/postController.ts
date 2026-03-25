import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getPosts = async (req: Request, res: Response) => {
  const { categoryId, limit = "10", offset = "0" } = req.query;

  const filters: any = {};
  if (categoryId) filters.categoryId = Number(categoryId);

  try {
    const posts = await prisma.post.findMany({
      where: filters,
      include: { category: true, author: { select: { id: true, username: true, email: true } } }, // Menambahkan author
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.post.count({ where: filters });

    res.json({
      data: posts,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data posts" });
  }
};
