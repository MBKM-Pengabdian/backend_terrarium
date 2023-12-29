import fs from 'fs';
import multer from 'multer'
import path from "path";
import config from '../../config/app.js';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';


const prisma = new PrismaClient();

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, config.IMG_UPLOAD_DIR)
   },
   filename: function (req, file, cb) {
      cb(null, uuidv4() + path.extname(file.originalname))
   }
});

export const upload = multer({
   storage,
   fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname)
      const allowedExt = ['.png', '.jpg', '.jpeg'];
      if (!allowedExt.includes(ext.toLowerCase())) {
         return cb("message : Invalid Image")
      }
      else {
         cb(null, true)
      }
   }
})

// Create a product
export const createProduct = async (req, res) => {
   try {

      const { user_id, product_name, description, price, stock_quantity } = req.body;

      let fileUrl = null

      if (req.file) {
         fileUrl = `/images/${req.file.filename}`;

         if (req.file.size > config.IMG_LIMIT_SIZE) {
            const size = (await fs.promises.stat(req.file.path)
               .then((respond) => {
                  return respond.size;
               })
               .catch((error) => {
                  return -1;
               }));

            const sizeAcceptedInPercent = Math.floor((size - (size - (config.IMG_LIMIT_SIZE / 2))) / (size / 100));

            await sharp(req.file.path)
               .jpeg({ quality: sizeAcceptedInPercent })
               .toFile(`${config.IMG_UPLOAD_DIR}/compress-${req.file.filename}`)
               .then((res) => {
                  fileUrl = `/images/compress-${req.file.filename}`;
               })
               .catch((err) => {
                  console.error(err);
               })
         }
      };
      const parsedPrice = parseFloat(price);
      const parsedStockQuantity = parseInt(stock_quantity)


      const newProduct = await prisma.Product.create({
         data: {
            user_id,
            uuid: uuidv4(),
            product_name,
            product_image: fileUrl,
            description,
            price: parsedPrice,
            stock_quantity: parsedStockQuantity,
         },
      });

      res.status(201).send({
         status: 201,
         message: "Created",
         data: newProduct
      });
   } catch (error) {
      console.error(error);
   }
}