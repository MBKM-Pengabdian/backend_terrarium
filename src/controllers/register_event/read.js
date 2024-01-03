import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRegistrationEvent = async (req, res) => {
   try {
      const registrations = await prisma.register_Event.findMany();
      console.log(registrations);

      res.status(200).json({
         status: 200,
         message: 'OK',
         data: registrations
      });
   } catch (error) {
      console.error('Error getting registrations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};