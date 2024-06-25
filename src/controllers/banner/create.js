import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";
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
}).fields([{ name: "img_banner", maxCount: 1 }]);

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

// Create a banner
export const createBanner = async (req, res) => {
  try {
    const { user_id, title_banner, desc_banner, priority_banner } = req.body;

    let fileUrl = "/images/no-image.png";
    if (req.files["img_banner"]) {
      fileUrl = `/images/${req.files["img_banner"][0].filename}`;
      const compressedImgBannerUrl = await compressImage(
        req.files["img_banner"][0].path,
        config.IMG_LIMIT_SIZE
      );
      fileUrl = compressedImgBannerUrl || fileUrl;
    }

    //create banner table
    const newBanner = await prisma.banner.create({
      data: {
        uuid: uuidv4(),
        user_id,
        img_banner: fileUrl,
        title_banner,
        desc_banner,
        priority_banner: parseInt(priority_banner),
        status_banner: 1, // 1:akctif, 2:non
      },
    });

    res.status(201).send({
      status: 201,
      message: "Created",
      data: newBanner,
    });
  } catch (error) {
    console.error(error);
  }
};
