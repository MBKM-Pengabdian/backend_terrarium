import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import config from '../../config/app.js';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.IMG_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file) {
            return cb(null, true);
        }

        const ext = path.extname(file.originalname);
        const allowedExt = ['.png', '.jpg', '.jpeg'];

        if (!allowedExt.includes(ext.toLowerCase())) {
            return cb("message : Invalid Image");
        } else {
            cb(null, true);
        }
    },
}).fields([
    { name: 'img_event', maxCount: 1 },
    { name: 'banner_event', maxCount: 1 }
]);

const compressImage = async (filePath, fileSizeLimit) => {
    try {
        if (!filePath) {
            throw new Error('File path is undefined.');
        }

        // Read the entire file into memory
        const fileBuffer = await fs.readFile(filePath);

        // Get the size of the file buffer
        const size = fileBuffer.length;

        if (size > fileSizeLimit) {
            const sizeAcceptedInPercent = Math.floor(((size - (fileSizeLimit / 2)) / size) * 100);

            await sharp(fileBuffer)
                .jpeg({ quality: sizeAcceptedInPercent })
                .toFile(`${config.IMG_UPLOAD_DIR}/compress-${path.basename(filePath)}`);

            return `/images/compress-${path.basename(filePath)}`;
        }
    } catch (error) {
        console.error(error);
    }

    return null;
};

const createTimelineEvents = async (timeline, detailEventId) => {
    try {
        if (!Array.isArray(timeline)) {
            throw new Error('Timeline should be an array.');
        }

        const createTimelinePromises = timeline.map((time) =>
            prisma.Timeline.create({
                data: {
                    detail_event_id: detailEventId,
                    title: time.title,
                    waktu: time.waktu,
                },
            })
        );

        const createdTimelineEvents = await Promise.all(createTimelinePromises);

        return createdTimelineEvents;
    } catch (error) {
        console.error(error);
    }

    return [];
};

export const updateEvent = async (req, res) => {
    try {
        const {
            user_id,
            title_event,
            price_event,
            status,
            description_event,
            sponsor_event,
            speaker_event,
            tag_event,
            date_event,
            last_regist_event,
            kuota_event,
            timeline,
            contact_person,
            place,
        } = req.body;

        const eventId = req.params.eventId;

        // Retrieve the existing event based on the provided event_id
        const existingEvent = await prisma.Event.findUnique({
            where: {
                uuid: eventId,
            },
            include: {
                detail_event: true, // Include the associated detail_event
            },
        });

        if (!existingEvent) {
            return res.status(404).json({
                status: 404,
                message: "Event not found",
            });
        }

        let updatedImgEventFileUrl = existingEvent.img_event;

        if (req.files['img_event']) {
            const compressedImgEventUrl = await compressImage(req.files['img_event'][0].path, config.IMG_LIMIT_SIZE);
            updatedImgEventFileUrl = compressedImgEventUrl || updatedImgEventFileUrl;
        }

        // Handle banner_event update
        let updatedBannerEventFileUrl = existingEvent.banner_event;

        if (req.files['banner_event']) {
            const compressedBannerEventUrl = await compressImage(req.files['banner_event'][0].path, config.IMG_LIMIT_SIZE);
            updatedBannerEventFileUrl = compressedBannerEventUrl || updatedBannerEventFileUrl;
        }

        // Update the event data
        const updatedEvent = await prisma.Event.update({
            where: {
                uuid: eventId,
            },
            data: {
                user_id,
                title_event,
                price_event,
                status: status === 'true',
                contact_person,
                place,
                img_event: updatedImgEventFileUrl
            },
        });

        const updatedDetailEvent = await prisma.Detail_Event.update({
            where: {
                id: existingEvent.detail_event[0].id,
            },
            data: {
                description_event,
                sponsor_event,
                speaker_event,
                tag_event,
                date_event,
                last_regist_event,
                kuota_event: parseInt(kuota_event),
                banner_event: updatedBannerEventFileUrl
            },
        });

        // Update the timeline events
        await prisma.Timeline.deleteMany({
            where: {
                detail_event_id: existingEvent.detail_event_id,
            },
        });

        const updatedTimelineEvents = await createTimelineEvents(timeline, existingEvent.detail_event[0].id);

        res.status(200).json({
            status: 200,
            message: "Updated",
            data: {
                event: {
                    ...updatedEvent,
                    detail_event: {
                        ...updatedDetailEvent,
                        timeline_event: updatedTimelineEvents,
                    },
                },
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};

