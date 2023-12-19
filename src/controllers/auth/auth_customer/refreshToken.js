import pkg from 'jsonwebtoken';
import config from '../../../config/app.js';
import { PrismaClient } from '@prisma/client';

export const refreshToken = async (req, res) => {
   try {
      const { sign, verify } = pkg;
      const prisma = new PrismaClient();
      const { refreshToken } = req.body;

      // Find the JWT in the database based on the refresh token
      const existingToken = await prisma.jwt_Customer.findFirst({
         where: {
            refresh_token: refreshToken,
         },
      });

      if (existingToken) {
         // Verify the refresh token
         verify(refreshToken, config.REFRESH_TOKEN_SECRET_CUSTOMER);

         // Create new access and refresh tokens
         const accessToken = sign({
            userId: existingToken.customer_id,
         }, config.ACCESS_TOKEN_SECRET_CUSTOMER, {
            expiresIn: '30d',
         });

         const newRefreshToken = sign({
            userId: existingToken.customer_id,
         }, config.REFRESH_TOKEN_SECRET_CUSTOMER, {
            expiresIn: '30d',
         });

         // Delete the old refresh token
         await prisma.jwt_Customer.deleteMany({
            where: {
               customer_id: existingToken.customer_id,
               refresh_token: refreshToken,
            },
         });

         // Create a new entry for the new refresh token
         await prisma.jwt_Customer.create({
            data: {
               customer_id: existingToken.customer_id,
               refresh_token: newRefreshToken,
            },
         });

         return res.status(201).send({
            message: 'SUCCESS',
            data: {
               accessToken,
               refresh_token: newRefreshToken,
            },
         });
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
      console.error(error);
      return res.status(500).send({
         message: 'An Error Has Occurred',
      });
   }
};
