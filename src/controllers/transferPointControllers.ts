import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const transferPoints = async (req: Request, res: Response, next: any) => {
  const { amount, senderId, receiverId } = req.body;
  const transferAmount = Number(amount);
  
  try {
    // Validasi Input
    if (!senderId || !receiverId) {
      throw { status: 400, message: "senderId dan receiverId wajib diisi" };
    }

    if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
      throw { status: 400, message: "Jumlah point harus lebih dari 0" };
    }

    // Menganbil data pengguna pengirim dan penerima
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: Number(senderId) } }),
      prisma.user.findUnique({ where: { id: Number(receiverId) } }),
    ]);

    // Validasi Keberadaan Pengguna
    if (!sender) {
      res.status(400).json({ message: "pengirim tidak ditemukan" });
      return;
    }
    if (!receiver) {
      res.status(400).json({ message: "penerima tidak ditemukan" });
      return;
    }

    // Validasi Saldo Point Pengirim
    if (sender.points < transferAmount) {
      throw { status: 400, message: "point tidak mencukupi" };
    }

    // ACID adalah empat prinsip utama (Atomicity, Consistency, Isolation, Durability)
    // Atomicity (Atomisitas): Transaksi diperlakukan sebagai satu kesatuan utuh.
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: senderId },
        data: { points: { decrement: amount } },
      });

      await tx.user.update({
        where: { id: receiverId },
        data: { points: { increment: amount } },
      });

      res.json("transfer point berhasil");
    });
  } catch (error) {
    next(error);
  }
};


export const userPoints = async (req: Request,
  res: Response,
  next: any) => {

  try {
    const userId = Number(req.params.id)
    const userPoints = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        points: true,
      },
    });

    res.status(200).json({ message: "data ditemukan", data: userPoints });

  } catch (error) {
    next(error);
  }
};