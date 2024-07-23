import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fungsi untuk menghapus kode promo
export const deletePromoCode = async (req, res) => {
  const { id_codepromo } = req.params;
  try {
    const promo = await prisma.promo_Code.findUnique({
      where: { uuid: id_codepromo },
    });

    if (!promo) {
      return res.status(404).json({
        status: 404,
        message: "Kode promo tidak ditemukan",
      });
    }

    await prisma.promo_Code.delete({
      where: { uuid: id_codepromo },
    });

    res.status(200).json({
      status: 200,
      message: "Kode promo berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting promo code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
