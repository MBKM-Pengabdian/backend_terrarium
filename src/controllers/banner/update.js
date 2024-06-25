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

// Update a Banner
export const updateBanner = async (req, res) => {
  const { bannerId } = req.params;
  const { user_id, title_banner, desc_banner, priority_banner, status_banner, } =
    req.body;

  const bannerExist = await prisma.banner.findUnique({
    where: { uuid: bannerId },
  });

  if (!bannerExist) {
    return res.status(404).json({ error: "Banner not found" });
  }

  let updatedImgBannerFileUrl = bannerExist.img_banner;

  if (req.files["img_banner"]) {
    const compressedImgEventUrl = await compressImage(
      req.files["img_banner"][0].path,
      config.IMG_LIMIT_SIZE
    );
    updatedImgBannerFileUrl = compressedImgEventUrl || updatedImgBannerFileUrl;
  }

  const updatedBanner = await prisma.banner.update({
    where: {
      uuid: bannerId,
    },
    data: {
      user_id,
      img_banner: updatedImgBannerFileUrl,
      title_banner,
      desc_banner,
      priority_banner: parseInt(priority_banner),
      status_banner: parseInt(status_banner),
    },
  });

  res.status(200).send({
    status: 200,
    message: "Updated",
    data: updatedBanner,
  });
};
