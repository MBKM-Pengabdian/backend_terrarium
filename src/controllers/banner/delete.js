import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Delete a banner
export const deleteBanner = async (req, res) => {
  const { bannerId } = req.params;

  const deletedBanner = await prisma.banner.delete({
    where: {
      uuid: bannerId,
    },
  });

  res.status(200).send({
    status: 200,
    message: "Data Banner berhasil dihapus",
  });
};
