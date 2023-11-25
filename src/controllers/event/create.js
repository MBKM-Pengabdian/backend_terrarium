import {
    PrismaClient
} from '@prisma/client';
import {
    v4 as uuidv4
} from 'uuid'

const prisma = new PrismaClient();

// Create a event
export const createEvent = async (req, res) => {
    try {
        const {
            user_id,
            img_event,
            banner_event,
            title_event,
            price_event,
            tag_event,
            kuota_event,
            date_event,
            last_regist_event,
            sisa_event,
            status,
        } = req.body;

        const newEvent = await prisma.event.create({
            data: {
                uuid: uuidv4(),
                user_id,
                img_event,
                banner_event,
                title_event,
                price_event,
                tag_event,
                date_event,
                last_regist_event,
                kuota_event,
                sisa_event,
                status,
            },
        });

        res.status(201).send({
            status: 201,
            message: "Created",
            data: newEvent
        });
    } catch (error) {
        console.error(error);
    }
}