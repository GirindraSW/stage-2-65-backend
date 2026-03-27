import { Request, Response } from "express";
import prisma from "../../prisma/client";

// Endpoint: POST /suppliers/stock — Update stock dari beberapa supplier sekaligus
export const updateStocks = async (req: Request, res: Response) => {
  const { updates } = req.body; // Array of { supplierId, productId, quantity }

  try {
    // Validasi awal: pastikan updates ada dan array
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({
        error: "Format request tidak valid. Harus berupa array updates.",
      });
    }

    // Validasi tiap update: cek supplier dan product ada, dan stock tidak negatif
    for (const update of updates) {
      const { supplierId, productId, quantity } = update;

      // Cek apakah supplier ada
      const supplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
      });
      if (!supplier) {
        return res.status(404).json({
          error: `Supplier dengan ID ${supplierId} tidak ditemukan.`,
        });
      }

      // Cek apakah product ada
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        return res.status(404).json({
          error: `Produk dengan ID ${productId} tidak ditemukan.`,
        });
      }

      // Cek apakah stock akan jadi negatif
      const currentStock = await prisma.stock.findUnique({
        where: {
          productId_supplierId: {
            productId,
            supplierId,
          },
        },
      });

      if (!currentStock) {
        return res.status(404).json({
          error: `Stock untuk produk ${productId} dan supplier ${supplierId} tidak ditemukan.`,
        });
      }

      const newQuantity = currentStock.quantity + quantity;
      if (newQuantity < 0) {
        return res.status(400).json({
          error: `Stock untuk produk ${productId} tidak boleh negatif. Saat ini: ${currentStock.quantity}, update: ${quantity}`,
        });
      }
    }

    // Jika semua validasi lolos, lakukan update dalam transaction
    const result = await prisma.$transaction(
      updates.map((update: any) => {
        return prisma.stock.update({
          where: {
            productId_supplierId: {
              productId: update.productId,
              supplierId: update.supplierId,
            },
          },
          data: {
            quantity: {
              increment: update.quantity,
            },
          },
        });
      })
    );

    // Tambahkan poin ke user (misal: admin yang update stock)
    const adminId = 1; // ganti dengan ID user yang login
    await prisma.user.update({
      where: { id: adminId },
      data: { points: { increment: 10 } }, // reward 10 poin
    });

    res.status(200).json({
      message: "Stock berhasil diperbarui",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Terjadi kesalahan internal server",
      details: error.message,
    });
  }
};

