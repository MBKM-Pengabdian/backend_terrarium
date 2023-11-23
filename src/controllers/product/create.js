import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

// Create a product
export const createProduct = async (req, res) => {
   try {
      const { user_id, product_name, product_image, description, price, stock_quantity } = req.body;

      const newProduct = await prisma.Product.create({
         data: {
            user_id,
            uuid: uuidv4(),
            product_name,
            product_image,
            description,
            price,
            stock_quantity,
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