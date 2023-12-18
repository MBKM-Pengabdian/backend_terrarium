import { PrismaClient } from '@prisma/client';

export const logout = async (req, res) => {
   try {
      const prisma = new PrismaClient();
      const { refreshToken } = req.body;

      await prisma.jwt.deleteMany({
         where: {
            refresh_token: refreshToken
         }
      });
      return res.status(200).send({
         status: 200,
         message: `SUCCESS`,
      });
   } catch (error) {
      return res.status(500).send({
         message: 'An Error Has Occured'
      });
   }
}
