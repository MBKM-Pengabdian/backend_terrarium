import bcrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
import config from '../../../config/app.js';
import { PrismaClient } from '@prisma/client';

export const login = async (req, res) => {
   try {
      const { sign } = pkg;
      const prisma = new PrismaClient();
      const { username, password } = req.body;

      // Check If Username Exist
      const getUserByUsernameAndPassword = await prisma.customer.findFirst({
         where: {
            username
         }
      });

      if (getUserByUsernameAndPassword !== null) {
         // Check Password
         const isPasswordMatch = bcrypt.compareSync(password, getUserByUsernameAndPassword.password);

         if (isPasswordMatch) {

            const accessTokenSecret = config.ACCESS_TOKEN_SECRET_CUSTOMER
            const refreshTokenSecret = config.REFRESH_TOKEN_SECRET_CUSTOMER

            const accessToken = sign({
               customerId: getUserByUsernameAndPassword.uuid
            }, accessTokenSecret, {
               expiresIn: '30d'
            });

            const refresh_token = sign({
               customerId: getUserByUsernameAndPassword.uuid
            }, refreshTokenSecret, {
               expiresIn: '30d'
            });

            // Insert New Token
            await prisma.jwt_Customer.create({
               data: {
                  customer_id: getUserByUsernameAndPassword.uuid,
                  refresh_token,
               }
            });

            return res.status(200).send({
               message: 'SUCCESS',
               data: {
                  customerId: getUserByUsernameAndPassword.uuid,
                  username: getUserByUsernameAndPassword.username,
                  email: getUserByUsernameAndPassword.email,
                  access_token: accessToken,
                  refresh_token: refresh_token
               }
            });
         }

         return res.status(404).send({
            message: 'No User Found With Given Username / Password',
         });
      }

      return res.status(404).send({
         message: 'No User Found',
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send({
         message: 'An Error Has Occurred'
      });
   }
};