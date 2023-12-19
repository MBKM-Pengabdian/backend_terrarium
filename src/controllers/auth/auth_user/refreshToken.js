import pkg from 'jsonwebtoken';
import config from '../../../config/app.js';
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

      try {
         if (getJwtByUserIdAndToken !== null) {
            const decodedToken = verify(refreshToken, getJwtByUserIdAndToken.role === 'superadmin'
               ? config.REFRESH_TOKEN_SECRET_SUPER_ADMIN
               : config.REFRESH_TOKEN_SECRET_ADMIN);

            const userIdFromToken = decodedToken.userId;

            const accessTokenSecret = getJwtByUserIdAndToken.role === 'superadmin'
               ? config.ACCESS_TOKEN_SECRET_SUPER_ADMIN
               : config.ACCESS_TOKEN_SECRET_ADMIN;

            const refreshTokenSecret = getJwtByUserIdAndToken.role === 'superadmin'
               ? config.REFRESH_TOKEN_SECRET_SUPER_ADMIN
               : config.REFRESH_TOKEN_SECRET_ADMIN;

            const accessToken = sign({
               userId: userIdFromToken
            }, accessTokenSecret, {
               expiresIn: '30d'
            });

            const refresh_token = sign({
               userId: userIdFromToken
            }, refreshTokenSecret, {
               expiresIn: '30d'
            });

            await prisma.jwt.deleteMany({
               where: {
                  user_id: userIdFromToken,
                  refresh_token: refreshToken,
               }
            });

            await prisma.jwt.create({
               data: {
                  user: getJwtByUserIdAndToken.user_id,
                  refresh_token,
                  role: getJwtByUserIdAndToken.role,
                  user: {
                     connect: {
                        uuid: getJwtByUserIdAndToken.user_id,
                     }
                  }
               }
            });

            return res.status(201).send({
               message: 'SUCCESS',
               data: {
                  accessToken,
                  refresh_token
               }
            });
         }
      } catch (error) {
         console.log(error);

         if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
               message: 'TOKEN_EXPIRED',
            });
         }

      }

      if (!refreshToken) {
         return res.status(404).send({
            message: 'No Token Found',
         });
      }

      res.status(401).send({
         message: 'INVALID_TOKEN',
      });

   } catch (error) {
      console.log(error);
      return res.status(500).send({
         message: 'An Error Has Occured'
      });
   }
}
