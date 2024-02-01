import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all carts
export const getAllCart = async (req, res) => {
   try {
      const customer_id = req.params.customer_id;

      const cart = await prisma.cart.findMany({
         where: {
            customer_id,
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