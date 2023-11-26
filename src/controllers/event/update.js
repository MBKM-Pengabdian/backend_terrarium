import {
    PrismaClient
} from '@prisma/client';
const prisma = new PrismaClient();

// Update a event
export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const {
            user_id,
            img_event,
            title_event,
            price_event,
            status,
            detailEvent
        } = req.body;

        const updatedEvent = await prisma.event.update({
            where: {
                uuid: eventId
            },
            data: {
                user_id,
                img_event,
                title_event,
                price_event,
                status,
                detail_event: {
                    update: detailEvent.forEach(async detail => {
                        await prisma.detail_Event.update({
                            where: {
                                id: detail.id
                            },
                            data: {
                                description_event: detail.description_event,
                                sponsor_event: detail.sponsor_event,
                                speaker_event: detail.speaker_event,
                                banner_event: detail.banner_event,
                                tag_event: detail.tag_event,
                                date_event: detail.date_event,
                                last_regist_event: detail.last_regist_event,
                                kuota_event: detail.kuota_event,
                                sisa_event: detail.sisa_event,
                                timeline: {
                                    deleteMany: {},
                                    createMany: {
                                        data: detail.timeline.map(time => ({
                                            title: time.title,
                                            waktu: time.waktu,
                                        })),
                                    },
                                },
                            },
                        });
                    }),
                },
            },
            include: {
                detail_event: {
                    include: {
                        timeline: true,
                    },
                },
            },
        });

        res.status(200).json({
            status: 200,
            message: 'Event updated successfully',
            data: updatedEvent,
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
};