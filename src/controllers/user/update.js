import bycrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Update a product
export const updateUser = async (req, res) => {
   try {
      const { userId } = req.params;
      const { role, username, email, password, phone, address } = req.body;

      const hashedPassword = bycrypt.hashSync(password, 10);

      const updatedUser = await prisma.user.update({
         where: { uuid: userId },
         data: {
            role,
            username,
            email,
            password: hashedPassword,
            phone,
            address
         },
      });

      res.status(200).send({
         status: 200,
         message: "Updated",
         data: updatedUser
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};