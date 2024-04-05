import { PrismaClient } from "@prisma/client";
import { dateFormat } from "../../utils/date-format.js";
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
}).fields([{ name: "photo", maxCount: 1 }]);

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

// Controller to handle request creation
export const createSpecialRequest = async (req, res) => {
  const {
    customer_id,
    fullname,
    phone_number,
    email,
    customer_city,
    customer_address,
    service_type,
    description,
    start_project,
    budget_estimation,
    project_location,
  } = req.body;
  try {
    let imgSpecialReqFileUrl = null;
    if (req.files["photo"]) {
      imgSpecialReqFileUrl = `/images/${req.files["photo"][0].filename}`;
      const compressedImgSpecialReqtUrl = await compressImage(
        req.files["photo"][0].path,
        config.IMG_LIMIT_SIZE
      );
      imgSpecialReqFileUrl =
        compressedImgSpecialReqtUrl || imgSpecialReqFileUrl;
    }

    const newSpecialRequest = await prisma.special_Request.create({
      data: {
        customer_id,
        fullname,
        phone_number,
        email,
        customer_city,
        customer_address,
        service_type,
        description,
        start_project: dateFormat(start_project),
        budget_estimation: Number(budget_estimation),
        project_location,
        photo: imgSpecialReqFileUrl,
      },
    });

    const response = {
      "customer-data": {
        fullname,
        phone_number,
        email,
        customer_city,
        customer_address,
      },
      "special-request": {
        service_type,
        description,
        start_project: dateFormat(start_project),
        budget_estimation,
        project_location,
        photo: imgSpecialReqFileUrl,
      },
      created_at: newSpecialRequest.created_at.toISOString(),
    };

    res.status(201).send({
      status: 201,
      message: "Created",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
