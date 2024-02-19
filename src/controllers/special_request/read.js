import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Retrieve all customers
export const getAllSpecialReq = async (req, res) => {
   try {
      const specialRequest = await prisma.special_Request.findMany();
      res.status(200).send({
         status: 200,
         message: "Success",
         data: specialRequest
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};