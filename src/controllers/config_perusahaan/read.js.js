import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getConfigPrsh = async (req, res) => {
  try {
    const responseDataPrsh = await prisma.config_perusahaan.findFirst();
    
    // Cek jika data kosong
    if (!responseDataPrsh) {
      return res.status(404).send({
        status: 404,
        message: "Data not found",
      });
    }

    res.status(200).send({
      status: 200,
      message: "OK",
      data: responseDataPrsh,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
