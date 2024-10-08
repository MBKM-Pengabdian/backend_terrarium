import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await prisma.promo_Code.findMany();
    
    // Map to collect customers data based on allowed_customer_ids
    const promoCodesWithCustomers = await Promise.all(promoCodes.map(async promo => {
      let allowedCustomerIds = JSON.parse(promo.allowed_customer_ids || "[]");
      let customers = [];
      
      if (allowedCustomerIds.length > 0) {
        customers = await prisma.customer.findMany({
          where: {
            uuid: {
              in: allowedCustomerIds,
            },
          },
        });
      }

      return {
        ...promo,
        customers: customers,
      };
    }));

    res.status(200).json({
      status: 200,
      data: promoCodesWithCustomers,
    });
  } catch (error) {
    console.error("Error getting promo codes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
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

    // Validasi apakah customer_id sudah terdapat dalam used_customer_ids
    const usedCustomerIds = promo.used_customer_ids ? JSON.parse(promo.used_customer_ids) : [];
    if (usedCustomerIds.includes(customer_id)) {
      return res.status(400).json({
        status: 400,
        message: "Kode promo sudah pernah anda gunakan",
      });
    }

    // Jika semua validasi berhasil, kirim respons sukses dengan data promo
    res.status(200).json({
      status: 200,
      message: "Kode promo valid",
      promoCode: promo,
    });
  } catch (error) {
    console.error("Error checking promo code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
