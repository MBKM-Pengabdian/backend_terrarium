import {
    PrismaClient
} from '@prisma/client';
const prisma = new PrismaClient();

// Read all events
export const getAllEvent = async (req, res) => {
    const events = await prisma.event.findMany({
        include: {
            detail_event: {
                include: {
                    timeline: true, // Include timeline details
                },
            },
        },
        orderBy: {
            created_at: 'asc', // Urutkan berdasarkan created_at secara asc
        },
    });

    res.status(200).json({
        status: 200,
        message: 'OK',
        data: events,
    });

};

// Read a specific events
export const geteventById = async (req, res) => {
    const {
        eventId
    } = req.params;
    const event = await prisma.event.findUnique({
        where: {
            uuid: eventId
        },
        include: {
            detail_event: {
                include: {
                    timeline: true, // Include timeline details
                },
            },
        },
    });

    if (!event) {
        return res.status(404).json({
            error: 'Event not found'
        });
    }

    res.status(200).send({
        status: 200,
        message: "OK",
        data: event
    });
};