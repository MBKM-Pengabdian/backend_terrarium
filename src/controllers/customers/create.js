import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Create a customer
export const createCustomer = async (req, res) => {
   try {
      const { username, email, password, phone, address } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newCustomer = await prisma.customer.create({
         data: {
            uuid: uuidv4(),
            email,
            username,
            phone,
            address,
            password: hashedPassword,
         },
      });

      res.status(201).send({
         status: 201,
         message: "Created",
         data: newCustomer
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};