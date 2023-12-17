import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Delete a customer by UUID
export const deleteUser = async (req, res) => {
   try {
      const { userId } = req.params;

      await prisma.user.delete({
         where: { uuid: userId },
      });

      res.status(200).send({
         status: 200,
         message: "Data user berhasil dihapus",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};