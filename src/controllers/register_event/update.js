import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";
import config from "../../config/app.js";
import { sendTicketToEmail } from "../../utils/myfunction.js";
import { getFormattedDate, getFormattedTime, myDate } from "../../utils/date-format.js";

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
    const allowedExt = [".png", ".jpg", ".jpeg"];

    if (!allowedExt.includes(ext.toLowerCase())) {
      return cb("message : Invalid Image");
    } else {
      cb(null, true);
    }
  },
}).fields([{ name: "photo_bukti", maxCount: 1 }]);

const compressImage = async (filePath, fileSizeLimit) => {
  try {
    if (!filePath) {
      throw new Error("File path is undefined.");
    }

    // Read the entire file into memory
    const fileBuffer = await fs.readFile(filePath);

    // Get the size of the file buffer
    const size = fileBuffer.length;

    if (size > fileSizeLimit) {
      const sizeAcceptedInPercent = Math.floor(
        ((size - fileSizeLimit / 2) / size) * 100
      );

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

export const uploadBuktiBayarEvent = async (req, res) => {
  const { regisEventID } = req.params;
  const { foto } = req.body;
  try {
    let photoBuktiFileUrl = null;
    if (req.files["photo_bukti"]) {
      photoBuktiFileUrl = `/images/${req.files["photo_bukti"][0].filename}`;
      const compressedImgEventUrl = await compressImage(
        req.files["photo_bukti"][0].path,
        config.IMG_LIMIT_SIZE
      );
      photoBuktiFileUrl = compressedImgEventUrl || photoBuktiFileUrl;
    }

    const regisEvent = await prisma.register_Event.findUnique({
      where: { uuid: regisEventID },
    });

    if (!regisEvent) {
      return res.status(404).json({ error: "Registration Event not found" });
    }

    const udpatePhotoBukti = await prisma.register_Event.update({
      where: { uuid: regisEventID },
      data: { status_regis: 2, bukti_bayar: photoBuktiFileUrl },
    });

    res.json({
      status: 200,
      message: "Photo successfully Upload",
      udpatePhotoBukti,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStatusRegistrationEvent = async (req, res) => {
  const { regisEventID } = req.params;
  const { status, alasan } = req.body;

  try {
    const registrasiEvent = await prisma.register_Event.findUnique({
      where: { uuid: regisEventID },
      include: {
        event: {
          include: {
            detail_event: true,
          },
        },
      },
    });
    if (!registrasiEvent) {
      return res.status(404).json({ error: "Registrasi Event not found" });
    }

    const udpateRegistrasiEvent = await prisma.register_Event.update({
      where: { uuid: regisEventID },
      data: { status_regis: status, alasan_bayar: alasan },
    });
    const dataRegist = registrasiEvent
    const dataEvent = registrasiEvent.event
    const dataDetailEvent = registrasiEvent.event.detail_event[0]

    if (status == 3) {
      const dataSend = {
        username: dataRegist.fullname_customer,
        event_title: dataEvent.title_event,
        date: getFormattedDate(dataDetailEvent.date_event),
        time: getFormattedTime(dataDetailEvent.date_event),
        place: dataEvent.place,
        codeqr: dataRegist.token_registration,
        toEmail: dataRegist.email_customer,
        wag: dataEvent.wag,
        no: dataRegist.token_registration,
        terdaftarAt: myDate(dataRegist.created_at),
      };
      const resSendTicket = sendTicketToEmail(dataSend);
    }

    res.json({
      status: 200,
      message: "Status successfully Update",
      udpateRegistrasiEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
