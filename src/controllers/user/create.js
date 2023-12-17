import bycrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

// Create a product
export const createUser = async (req, res) => {
   try {
      const { role, username, email, password, phone, address } = req.body;

      const hashedPassword = bycrypt.hashSync(password, 10);

      const newUser = await prisma.user.create({
         data: {
            uuid: uuidv4(),
            role,
            username,
            email,
            password: hashedPassword,
            phone,
            address
         },
      });

      res.status(201).send({
         status: 201,
         message: "Created",
         data: newUser
      });
   } catch (error) {
      console.error(error);
   }
}