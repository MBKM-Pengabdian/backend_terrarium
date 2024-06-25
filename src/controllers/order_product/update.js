import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";
import config from "../../config/app.js";
import {
  getFormattedDate,
  getFormattedTime,
  myDate,
} from "../../utils/date-format.js";

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

export const uploadBuktiBayarOrderProduct = async (req, res) => {
  const { orderID } = req.params;
  const { foto } = req.body;
  try {
    let photoBuktiFileUrl = null;
    if (req.files["photo_bukti"]) {
      photoBuktiFileUrl = `/images/${req.files["photo_bukti"][0].filename}`;
      const compressedImgBuktiUrl = await compressImage(
        req.files["photo_bukti"][0].path,
        config.IMG_LIMIT_SIZE
      );
      photoBuktiFileUrl = compressedImgBuktiUrl || photoBuktiFileUrl;
    }

    const orderProduct = await prisma.order_Product.findUnique({
      where: { uuid: orderID },
    });

    if (!orderProduct) {
      return res.status(404).json({ error: "Order product not found" });
    }

    const udpatePhotoBukti = await prisma.order_Product.update({
      where: { uuid: orderID },
      data: { order_status: 2, bukti_bayar: photoBuktiFileUrl },
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

export const updateStatusOrderProduct = async (req, res) => {
  const { orderID } = req.params;
  const { status, alasan } = req.body;
console.log(alasan);
  try {
    const pesananOrder = await prisma.order_Product.findUnique({
      where: { uuid: orderID },
      include: {
        order_item: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
    if (!pesananOrder) {
      return res.status(404).json({ error: "Pesanan not found" });
    }

    const udpatePesanan = await prisma.order_Product.update({
      where: { uuid: orderID },
      data: { order_status: status, alasan_bayar: alasan },
    });
    
    res.json({
      status: 200,
      message: "Status successfully Update",
      udpatePesanan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};