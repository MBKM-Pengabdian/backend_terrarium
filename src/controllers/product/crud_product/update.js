import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import config from '../../../config/app.js';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, config.IMG_UPLOAD_DIR);
   },
   filename: function (req, file, cb) {
      cb(null, uuidv4() + path.extname(file.originalname));
   },
});

const upload = multer({
   storage,
   fileFilter: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const allowedExt = ['.png', '.jpg', '.jpeg'];
      if (!allowedExt.includes(ext.toLowerCase())) {
         return cb("message: Invalid Image");
      } else {
         cb(null, true);
      }
   },
}).single('product_image');

export const updateProduct = async (req, res) => {
   try {
      // Apply the Multer middleware here
      upload(req, res, async function (err) {
         if (err instanceof multer.MulterError) {
            return res.status(400).send({
               status: 400,
               message: "Error uploading file",
            });
         } else if (err) {
            return res.status(400).send({
               status: 400,
               message: err.message || "Invalid Image",
            });
         }

         const { productId } = req.params;
         const { user_id, product_name, description, price, stock_quantity, status_product } = req.body;
         const parsedPrice = parseFloat(price);
         const parsedStockQuantity = parseInt(stock_quantity);

         // Validate input data
         if (!productId || !user_id || !product_name || isNaN(parsedPrice) || isNaN(parsedStockQuantity)) {
            return res.status(400).send({
               status: 400,
               message: "productId, User id, Product Name, Price, and Stock Quantity are required fields.",
            });
         }

         const existingProduct = await prisma.product.findFirst({
            where: { uuid: productId },
         });

         if (!existingProduct) {
            return res.status(404).send({
               status: 404,
               message: "Product not found",
            });
         }

         let updateData = {
            user_id,
            product_name,
            description,
            price: parsedPrice,
            stock_quantity: parsedStockQuantity,
            status_product: parseInt(status_product) 
         };

         if (req.file) {
            const size = (await fs.promises.stat(req.file.path)
               .then((respond) => respond.size)
               .catch((error) => -1));

            let sizeAcceptedInPercent = Math.floor((size - (size - (config.IMG_LIMIT_SIZE / 2))) / (size / 100));

            // Ensure that sizeAcceptedInPercent is within the valid range (1 to 100)
            sizeAcceptedInPercent = Math.min(100, Math.max(1, sizeAcceptedInPercent));

            await sharp(req.file.path)
               .jpeg({ quality: sizeAcceptedInPercent })
               .toFile(`${config.IMG_UPLOAD_DIR}/compress-${req.file.filename}`)
               .then(() => {
                  updateData.product_image = `/images/compress-${req.file.filename}`;

                  fs.promises.unlink(req.file.path)
                     .then(() => null)
                     .catch((err) => console.error('Error deleting original file:', err));
               })
               .catch((err) => {
                  console.error(err);
                  return res.status(500).send({
                     status: 500,
                     message: "An error occurred while updating the product image.",
                  });
               });
         }

         const updatedProduct = await prisma.Product.update({
            where: { uuid: productId },
            data: updateData,
         });

         res.status(200).send({
            status: 200,
            message: "Updated",
            data: updatedProduct,
         });

      });

   } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send({
         status: 500,
         message: "An error occurred while updating the product.",
      });
   }
};
