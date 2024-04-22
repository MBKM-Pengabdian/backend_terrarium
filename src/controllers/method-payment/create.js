import fs from "fs/promises";
import multer from "multer";
import path from "path";
import config from "../../config/app.js";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.IMG_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
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
}).fields([{ name: "img_pay", maxCount: 1 }]);

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

// Create a Method
export const createMethodPay = async (req, res) => {
  try {
    const { name_method, no_rek, nama_rek } = req.body;

    let fileUrl = null;
    if (req.files["img_pay"]) {
      fileUrl = `/images/${req.files["img_pay"][0].filename}`;
      const compressedImgEventUrl = await compressImage(
        req.files["img_pay"][0].path,
        config.IMG_LIMIT_SIZE
      );
      fileUrl = compressedImgEventUrl || fileUrl;
    }

    const newMethod = await prisma.method_Payment.create({
      data: {
        uuid: uuidv4(),
        name_method,
        img_pay: fileUrl,
        nama_rek,
        no_rek,
      },
    });

    res.status(201).send({
      status: 201,
      message: "Created",
      data: newMethod,
    });
  } catch (error) {
    console.error(error);
  }
};
