import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Increase quantity
export const updateStatusSpecialRequest = async (req, res) => {
  const { specialReqID } = req.params;
  const { status, alasan } = req.body;

  try {
    const specialRequest = await prisma.special_Request.findUnique({
      where: { uuid: specialReqID },
    });

    if (!specialRequest) {
      return res.status(404).json({ error: "Special Request not found" });
    }


   const udpateSpecialReq = await prisma.special_Request.update({
      where: { uuid: specialReqID },
      data: { status: status, alasan: alasan},
    });

    res.json({
      status: 200,
      message: "Status successfully Update",
      udpateSpecialReq,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
