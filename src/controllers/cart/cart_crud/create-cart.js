import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const storeCart = async (req, res) => {
   try {
      const { customer_id, product_id, quantity } = req.body;

      const existingCartItem = await prisma.cart.findFirst({
         where: {
            customer_id,
            product_id,
         },
      });

      if (existingCartItem) {
         // If the product exists, update the quantity by incrementing it
         const updatedCart = await prisma.cart.update({
            where: {
               uuid: existingCartItem.uuid,
            },
            data: {
               quantity: existingCartItem.quantity + quantity,
            },
         });

         res.json({
            status: 200,
            message: "Success",
            data: updatedCart,
         });
      } else {
         // If the product doesn't exist, create a new entry
         const newCartItem = await prisma.cart.create({
            data: {
               customer_id,
               product_id,
               quantity,
            },
         });

         res.json({
            status: 200,
            message: "Success",
            data: newCartItem,
         });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
