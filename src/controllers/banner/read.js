import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Read all banner
export const getAllBanner = async (req, res) => {
  const banners = await prisma.banner.findMany();
  res.status(200).send({
    status: 200,
    message: "OK",
    data: banners,
  });
};

// Read banner by priority and active
export const getBannerByPriorityActive = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        status_banner: 1,
      },
      orderBy: {
        priority_banner: "desc",
      },
    });

    res.status(200).send({
      status: 200,
      message: "OK",
      data: banners,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Read banner by id
export const getBannerById = async (req, res) => {
  const { bannerId } = req.params;

  try {
    const banner = await prisma.banner.findUnique({
      where: {
        uuid: bannerId,
      },
    });

    if (!banner) {
      return res.status(404).send({
        status: 404,
        message: "Banner not found",
      });
    }

    res.status(200).send({
      status: 200,
      message: "OK",
      data: banner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};
