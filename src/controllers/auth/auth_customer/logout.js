import { PrismaClient } from '@prisma/client';

export const logout = async (req, res) => {
   try {
      const prisma = new PrismaClient();
      const { refreshToken } = req.body;

      // Validate refreshToken
      if (!refreshToken || typeof refreshToken !== 'string') {
         return res.status(400).send({
            message: 'Invalid refreshToken provided',
         });
      }

      // Check if refreshToken exists in the database
      const existingToken = await prisma.jwt_Customer.findFirst({
         where: {
            refresh_token: refreshToken,
         },
      });

      if (!existingToken) {
         return res.status(404).send({
            message: 'Refresh token not found',
         });
      }

      // Delete the refreshToken from the database
      await prisma.jwt_Customer.deleteMany({
         where: {
            refresh_token: refreshToken,
         },
      });

      return res.status(200).send({
         status: 200,
         message: 'SUCCESS',
      });
   } catch (error) {
      console.error(error);
      return res.status(500).send({
         message: 'An error has occurred',
      });
   }
};
