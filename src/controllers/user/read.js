import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Read all products
export const getAllUsers = async (req, res) => {
   const users = await prisma.user.findMany();
   res.status(200).send({
      status: 200,
      message: "OK",
      data: users
   });
};

// Read a specific product
export const getUserById = async (req, res) => {
   const { userId } = req.params;
   const user = await prisma.user.findUnique({
      where: { uuid: userId },
   });

   if (!user) {
      return res.status(404).json({ error: 'User not found' });
   }

   res.status(200).send({
      status: 200,
      message: "OK",
      data: user
   });
};
