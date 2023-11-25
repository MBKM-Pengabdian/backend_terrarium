import {
    PrismaClient
} from '@prisma/client';
const prisma = new PrismaClient();

// Delete a event
export const deleteEvent = async (req, res) => {
    const {
        eventId
    } = req.params;

    const deletedEvent = await prisma.event.delete({
        where: {
            uuid: eventId
        },
    });

    res.status(200).send({
        status: 200,
        message: "Data event berhasil dihapus",
    });
};