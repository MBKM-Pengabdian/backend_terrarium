import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const storeCart = async (req, res) => {
   try {
      const { customer_id, product_id, quantity } = req.body;

      const cart = await prisma.cart.create({
         data: {
            customer_id,
            product_id,
            quantity,
         },
      });

      res.json({
         status: 200,
         message: "Success",
         data: cart
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};