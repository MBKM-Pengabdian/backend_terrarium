import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteCart = async (req, res) => {
   try {
      const uuid = req.params.uuid;

      const deletedCart = await prisma.cart.delete({
         where: {
            uuid,
         },
      });

      res.json({
         status: 200,
         message: "Cart deleted successfully",
         data: deletedCart
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
