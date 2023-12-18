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
      const getUserByUsernameAndPassword = await prisma.user.findFirst({
         where: {
            username
         }
      });

      if (getUserByUsernameAndPassword !== null) {
         // Check Password
         const isPasswordMatch = bcrypt.compareSync(password, getUserByUsernameAndPassword.password);

         if (isPasswordMatch) {
            const accessTokenSecret = getUserByUsernameAndPassword.role === 'superadmin'
               ? config.ACCESS_TOKEN_SECRET_SUPER_ADMIN
               : config.ACCESS_TOKEN_SECRET_ADMIN;

            const refreshTokenSecret = getUserByUsernameAndPassword.role === 'superadmin'
               ? config.REFRESH_TOKEN_SECRET_SUPER_ADMIN
               : config.REFRESH_TOKEN_SECRET_ADMIN;

            const accessToken = sign({
               userId: getUserByUsernameAndPassword.uuid
            }, accessTokenSecret, {
               // TODO Uncomment When Production
               expiresIn: '30d'
            });

            const refresh_token = sign({
               userId: getUserByUsernameAndPassword.uuid
            }, refreshTokenSecret, {
               expiresIn: '15s'
            });

            // Insert New Token
            await prisma.jwt.create({
               data: {
                  user_id: getUserByUsernameAndPassword.uuid,
                  refresh_token,
               }
            });

            return res.status(200).send({
               message: 'SUCCESS',
               data: {
                  userId: getUserByUsernameAndPassword.uuid,
                  username: getUserByUsernameAndPassword.username,
                  email: getUserByUsernameAndPassword.email,
                  role: getUserByUsernameAndPassword.role,
                  refreshToken: refresh_token,
                  accessToken: accessToken
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