import bycrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { validateUsername } from '../../../utils/validation.js'

export const register = async (req, res) => {
   try {
      const prisma = new PrismaClient();
      const { username, password, email, phone, address } = req.body;

      const checkUsername = validateUsername(username);

      if (!checkUsername) {
         return res.status(403).send({
            message: `Invalid Username (No Spaces And All Lowercase)`,
         });
      }

      if (checkUsername === null || email === null) {
         return res.status(500).send({
            message: 'An Error Has Occured'
         });
      }

      // Check If Theres User With Given Username
      const getUserByUsername = await prisma.customer.findFirst({
         where: {
            username
         },
      });

      // If No Then Good To Go
      if (getUserByUsername === null) {
         const hashedPassword = bycrypt.hashSync(password, 10);

         await prisma.customer.create({
            data: {
               email: email,
               username: username,
               phone: phone,
               address: address,
               password: hashedPassword,
            }
         });

         return res.status(201).send({
            status: 201,
            message: `SUCCESS`,
         });
      }

      return res.status(409).send({
         message: 'Username Already Exist',
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send({
         message: 'An Error Has Occured'
      });
   }
}