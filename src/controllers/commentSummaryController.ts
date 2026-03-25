import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const getCommentSummary = async (req: Request, res: Response) => {
  const { limit = "10", offset = "0", minComments = "0" } = req.query;
  const min = Number(minComments);

  try {
    const summary = await prisma.post.findMany({ // Menggunakan findMany pada Post
      select: {
        id: true,
        title: true,
        author: { // Menambahkan author ke dalam select
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        comments: { // Ordering berdasarkan jumlah komentar
          _count: "desc",
        },
      },
      take: Number(limit),
      skip: Number(offset),
    });

    const filtered = summary.filter((post) => post._count.comments >= min);

    res.json({
      data: filtered,
      total: filtered.length,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil summary komentar" });
  }
};
