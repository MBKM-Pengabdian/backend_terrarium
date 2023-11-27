import {
    PrismaClient
} from '@prisma/client';
const prisma = new PrismaClient();

// Update a Banner
export const updateBanner = async (req, res) => {
    const {
        bannerId
    } = req.params;
    const {
        user_id,
        img_banner,
        title_banner,
        desc_banner,
        priority_banner,
        status_banner,
    } = req.body;

    const updatedBanner = await prisma.banner.update({
        where: {
            uuid: bannerId
        },
        data: {
            user_id,
            img_banner,
            title_banner,
            desc_banner,
            priority_banner,
            status_banner,
        },
    });

    res.status(200).send({
        status: 200,
        message: "Updated",
        data: updateBanner
    });
};