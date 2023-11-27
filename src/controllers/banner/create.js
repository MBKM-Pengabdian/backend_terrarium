import {
    PrismaClient
} from '@prisma/client';
import {
    v4 as uuidv4
} from 'uuid'

const prisma = new PrismaClient();

// Create a banner
export const createBanner = async (req, res) => {
    try {
        const {
            user_id,
            img_banner,
            title_banner,
            desc_banner,
            priority_banner,
        } = req.body;

        //create banner table
        const newBanner = await prisma.Banner.create({
            data: {
                uuid: uuidv4(),
                user_id,
                img_banner,
                title_banner,
                desc_banner,
                priority_banner,
                status_banner: 1, // 1:akctif, 2:non
            },
        });

        res.status(201).send({
            status: 201,
            message: "Created",
            data: newBanner
        });
    } catch (error) {
        console.error(error);
    }
}