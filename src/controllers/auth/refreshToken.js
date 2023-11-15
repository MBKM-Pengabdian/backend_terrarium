import pkg from 'jsonwebtoken';
import config from '../../config/app.js';
import { PrismaClient } from '@prisma/client';

export const refreshToken = async (req, res) => {
   try {
      const { sign, verify } = pkg;
      const prisma = new PrismaClient();
      const { refreshToken } = req.body;

      const getJwtByUserIdAndToken = await prisma.jwt.findFirst({
         where: {
            refresh_token: refreshToken,
         },
      });

      if (getJwtByUserIdAndToken !== null) {
         verify(refreshToken, config.REFRESH_TOKEN_SECRET);

         const accessToken = sign({
            userId: getJwtByUserIdAndToken.user_id
         }, config.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m'
         });

         const refresh_token = sign({
            userId: getJwtByUserIdAndToken.user_id
         }, config.REFRESH_TOKEN_SECRET);

         await prisma.jwt.deleteMany({
            where: {
               user_id: getJwtByUserIdAndToken.user_id,
               refresh_token: refreshToken,
            }
         });

         await prisma.jwt.create({
            data: {
               user_id: getJwtByUserIdAndToken.user_id,
               refresh_token,
            }
         });

         return res.status(201).send({
            message: `SUCCESS`,
            data: {
               accessToken,
               refresh_token
            }
         });
      }

      return res.status(404).send({
         message: 'No Token Found',
      });
   } catch (error) {
      console.error(error);
      return res.status(500).send({
         message: 'An Error Has Occured'
      });
   }
}
