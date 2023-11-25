import {
    PrismaClient
} from '@prisma/client';
const prisma = new PrismaClient();

// Update a event
export const updateEvent = async (req, res) => {
    const {
        eventId
    } = req.params;
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

    const updatedEvent = await prisma.event.update({
        where: {
            uuid: eventId
        },
        data: {
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
        },
    });

    res.status(200).send({
        status: 200,
        message: "Updated",
        data: updateEvent
    });
};