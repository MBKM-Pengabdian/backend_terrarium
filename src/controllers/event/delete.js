import {
    PrismaClient
} from '@prisma/client';
const prisma = new PrismaClient();

// Delete a event
export const deleteEvent = async (req, res) => {
    const {
        eventId
    } = req.params;

    const registEventExist = await prisma.register_Event.findFirst({
        where: {
            event_id: eventId
        }
    })

    if (registEventExist) {
        return res.status(409).send({
            status: 409,
            message: "Gagal! Event sudah ada pendaftar",
        });
    }

    await prisma.event.delete({
        where: {
            uuid: eventId
        },
    });

    res.status(200).send({
        status: 200,
        message: "Data event berhasil dihapus",
    });
};