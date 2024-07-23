import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
import config from '../../config/app.js';
import { dateFormat } from '../../utils/date-format.js';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.IMG_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});

export const upload = multer({
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
])

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


export const createEvent = async (req, res) => {
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
            wag,
        } = req.body;

        let imgEventFileUrl = `/images/no-image.png`;
        let bannerEventFileUrl = `/images/no-image.png`;

        if (req.files['img_event']) {
            imgEventFileUrl = `/images/${req.files['img_event'][0].filename}`;
            const compressedImgEventUrl = await compressImage(req.files['img_event'][0].path, config.IMG_LIMIT_SIZE);
            imgEventFileUrl = compressedImgEventUrl || imgEventFileUrl;
        }

        if (req.files['banner_event']) {
            bannerEventFileUrl = `/images/${req.files['banner_event'][0].filename}`;
            const compressedBannerEventUrl = await compressImage(req.files['banner_event'][0].path, config.IMG_LIMIT_SIZE);
            bannerEventFileUrl = compressedBannerEventUrl || bannerEventFileUrl;
        }

        const newEvent = await prisma.Event.create({
            data: {
                user_id,
                uuid: uuidv4(),
                img_event: imgEventFileUrl,
                title_event,
                price_event,
                status: (status === 'true'),
                contact_person,
                place,
                wag,
            },
        });

        const parsedKuotaEvent = parseInt(kuota_event);

        const newDetailEvent = await prisma.Detail_Event.create({
            data: {
                event: { connect: { uuid: newEvent.uuid } },
                description_event,
                sponsor_event,
                speaker_event,
                banner_event: bannerEventFileUrl,
                tag_event,
                date_event,
                last_regist_event,
                kuota_event: parsedKuotaEvent,
            },
        });

        const createdTimelineEvents = await createTimelineEvents(timeline, newDetailEvent.id);

        res.status(201).json({
            status: 201,
            message: "Created",
            data: {
                event: {
                    ...newEvent,
                    detail_event: {
                        ...newDetailEvent,
                        timeline_event: createdTimelineEvents
                    },
                }
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
