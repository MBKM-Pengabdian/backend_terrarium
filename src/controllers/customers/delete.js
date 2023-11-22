import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Delete a customer by UUID
export const deleteCustomer = async (req, res) => {
   try {
      const { customerId } = req.params;

      await prisma.customer.delete({
         where: { uuid: customerId },
      });

      res.status(200).send({
         status: 200,
         message: "Data customer berhasil dihapus",
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};