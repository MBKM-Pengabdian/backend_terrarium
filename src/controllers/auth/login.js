import bycrypt from 'bcryptjs';
import pkg from 'jsonwebtoken';
import config from '../../config/app.js';
import { PrismaClient } from '@prisma/client';

export const login = async (req, res) => {
   try {
      const { sign, verify } = pkg;
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
         const isPasswordMatch = bycrypt.compareSync(password, getUserByUsernameAndPassword.password);

         if (isPasswordMatch) {
            const accessToken = sign({
               userId: getUserByUsernameAndPassword.id
            }, config.ACCESS_TOKEN_SECRET, {
               // TODO Uncomment When Production
               // expiresIn: '10m'
            });

            const refresh_token = sign({
               userId: getUserByUsernameAndPassword.id
            }, config.REFRESH_TOKEN_SECRET);

            // Insert New Token
            await prisma.jwt.create({
               data: {
                  user_id: getUserByUsernameAndPassword.id,
                  refresh_token,
               }
            });

            return res.status(200).send({
               message: 'SUCCESS',
               data: {
                  userId: getUserByUsernameAndPassword.id,
                  username: getUserByUsernameAndPassword.username,
                  email: getUserByUsernameAndPassword.email,
                  role: getUserByUsernameAndPassword.role,
                  accessToken,
                  refreshToken: refresh_token,
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
      return res.status(500).send({
         message: 'An Error Has Occured'
      });
   }
}