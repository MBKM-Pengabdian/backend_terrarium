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
            title_event,
            price_event,
            status,
            detailEvent
        } = req.body;

        //create event table
        const newEvent = await prisma.Event.create({
            data: {
                uuid: uuidv4(),
                user_id,
                img_event,
                title_event,
                price_event,
                status,
            },
        });

        //create detail event table
        detailEvent.forEach(async detail => {
            const newDetail = await prisma.Detail_Event.create({
                data: {
                    event_id: newEvent.uuid,
                    description_event: detail.description_event,
                    sponsor_event: detail.sponsor_event,
                    speaker_event: detail.speaker_event,
                    banner_event: detail.banner_event,
                    tag_event: detail.tag_event,
                    date_event: detail.date_event,
                    last_regist_event: detail.last_regist_event,
                    kuota_event: detail.kuota_event,
                    sisa_event: detail.sisa_event,
                }
            })

            //create timeline event table
            detail.timeline.forEach(async time => {
                await prisma.Timeline.create({
                    data: {
                        detail_event_id: newDetail.id,
                        title: time.title,
                        waktu: time.waktu,
                    }
                })
            });
        })

        res.status(201).send({
            status: 201,
            message: "Created",
            data: newEvent
        });
    } catch (error) {
        console.error(error);
    }
}