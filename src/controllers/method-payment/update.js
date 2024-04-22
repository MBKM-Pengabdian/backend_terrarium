import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import config from "../../config/app.js";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.IMG_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

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

export const updateMethodPay = async (req, res) => {
  const { methodPayId } = req.params;
  const { name_method, status_method, no_rek, nama_rek } = req.body;
  try {
    const methodPayExist = await prisma.method_Payment.findUnique({
      where: { uuid: methodPayId },
    });

    if (!methodPayExist) {
      return res.status(404).json({ error: "Method Pay not found" });
    }

    let updatedImgMethodFileUrl = methodPayExist.img_pay;

    if (req.files["img_pay"]) {
      const compressedImgEventUrl = await compressImage(
        req.files["img_pay"][0].path,
        config.IMG_LIMIT_SIZE
      );
      updatedImgMethodFileUrl = compressedImgEventUrl || updatedImgMethodFileUrl;
    }

    const updateMethodPay = await prisma.method_Payment.update({
      where: { uuid: methodPayId },
      data: {
        name_method,
        status_method: Number(status_method),
        no_rek,
        nama_rek,
        img_pay: updatedImgMethodFileUrl,
      },
    });

    res.json({
      status: 200,
      message: "Method Pay successfully update",
      updateMethodPay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
