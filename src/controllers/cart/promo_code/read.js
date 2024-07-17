import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkPromoCode = async (req, res) => {
  const { promo_code, customer_id } = req.body;
  try {
    // Cari kode promo berdasarkan kode yang diberikan
    const promo = await prisma.promo_Code.findUnique({
      where: { code: promo_code },
    });

    if (!promo) {
      return res.status(404).json({
        status: 404,
        message: "Kode promo tidak tersedia",
      });
    }

    // Validasi apakah kode promo masih berlaku
    if (promo.expiry_date < new Date()) {
      return res.status(400).json({
        status: 400,
        message: "Kode promo sudah kadaluarsa",
      });
    }

    // Validasi apakah customer_id terdaftar dalam allowed_customer_ids
    if (!promo.allowed_customer_ids.includes(customer_id)) {
      return res.status(400).json({
        status: 400,
        message: "Anda tidak bisa pakai kode promo ini",
      });
    }

    // Validasi apakah kode promo sudah mencapai batas penggunaan
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
      return res.status(400).json({
        status: 400,
        message: "Promo code has reached its usage limit",
      });
    }

    // Jika semua validasi berhasil, kirim respons sukses dengan data promo
    res.status(200).json({
      status: 200,
      message: "Promo code is valid",
      promoCode: promo,
    });
  } catch (error) {
    console.error("Error checking promo code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
