import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Increase quantity 
export const updateStatusSpecialRequest = async (req, res) => {
   const { specialReqID } = req.params;
   const { status } = req.body

   try {
      const specialRequest = await prisma.special_Request.findUnique({
         where: { uuid: specialReqID },
      });

      if (!specialRequest) {
         return res.status(404).json({ error: 'Special Request not found' });
      }

      // Increase quantity logic
      specialRequest.status = status;

      await prisma.special_Request.update({
         where: { uuid: specialReqID },
         data: { status: specialRequest.status },
      });

      res.json({ message: 'Status successfully Update', specialRequest });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
