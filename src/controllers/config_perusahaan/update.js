import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";
import config from "../../config/app.js";
import { dateFormat } from "../../utils/date-format.js";

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
}).fields([{ name: "logo_prsh", maxCount: 1 }]);

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

export const updateConfigPrsh = async (req, res) => {
  try {
    const {
      info_telp,
      info_alamat,
      info_email,
      email_mailer,
      password_mailer,
    } = req.body;

    const existingConfig = await prisma.config_perusahaan.findFirst({});

    let updateLogoPrsh = "/images/no-image.png";
    if (req.files["logo_prsh"]) {
      updateLogoPrsh = `/images/${req.files["logo_prsh"][0].filename}`;
      const compressedLogoPrshUrl = await compressImage(
        req.files["logo_prsh"][0].path,
        config.IMG_LIMIT_SIZE
      );
      updateLogoPrsh = compressedLogoPrshUrl || updateLogoPrsh;
    }

    if (!existingConfig) {
      await prisma.config_perusahaan.create({
        data: {
          info_telp,
          info_alamat,
          info_email,
          email_mailer,
          password_mailer,
          logo_prsh: updateLogoPrsh, // rapikan lagi yg utk gambar logo_prsh nya
        },
      });
    } else {
      const updatedLogoPrsh = req.files["logo_prsh"]
        ? updateLogoPrsh
        : existingConfig.logo_prsh;
      await prisma.config_perusahaan.update({
        where: {
          uuid: existingConfig.uuid,
        },
        data: {
          info_telp,
          info_alamat,
          info_email,
          email_mailer,
          password_mailer,
          logo_prsh: updatedLogoPrsh, // rapikan lagi yg utk gambar logo_prsh nya
        },
      });
    }
    res.status(200).send({
      status: 200,
      message: "Data Berhasil Diupdate",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
