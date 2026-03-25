import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getCommentsByPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = "10", offset = "0" } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(id) },
      include: { author: { select: { id: true, username: true, email: true } } }, // Menambahkan author
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.comment.count({ where: { postId: Number(id) } });

    res.json({
      data: comments,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil komentar" });
  }
};
