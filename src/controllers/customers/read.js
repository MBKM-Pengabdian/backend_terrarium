import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Retrieve all customers
export const getAllCustomers = async (req, res) => {
   try {
      const customers = await prisma.customer.findMany();
      res.status(200).send({
         status: 200,
         message: "OK",
         data: customers
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};

// Retrieve a single customer by UUID
export const getCustomerById = async (req, res) => {
   try {
      const { customerId } = req.params;
      const customer = await prisma.customer.findUnique({
         where: { uuid: customerId },
      });

      if (!customer) {
         return res.status(404).json({ error: 'Customer tidak ditemukan' });
      }

      res.status(200).send({
         status: 200,
         message: "OK",
         data: customer
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
