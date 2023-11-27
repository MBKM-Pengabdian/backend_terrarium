import {
    PrismaClient
} from '@prisma/client';
const prisma = new PrismaClient();

// Read all banner
export const getAllBanner = async (req, res) => {
    const banners = await prisma.banner.findMany();
    res.status(200).send({
        status: 200,
        message: "OK",
        data: banners
    });
};

// Read banner by priority and active
export const getBannerByPriorityActive = async (req, res) => {
    const banners = await prisma.banner.findMany({
        where: {
            status_banner: 1,
        },
        orderBy: {
            priority_banner: 'asc',
        },
    });

    res.status(200).send({
        status: 200,
        message: "OK",
        data: banners,
    });
};