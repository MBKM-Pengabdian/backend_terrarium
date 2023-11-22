import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Update a customer by UUID
export const updateCustomer = async (req, res) => {
   try {
      const { customerId } = req.params;
      const { first_name, last_name, email, password, phone, address } = req.body;

      const updatedCustomer = await prisma.customer.update({
         where: { uuid: customerId },
         data: {
            first_name,
            last_name,
            email,
            password,
            phone,
            address,
         },
      });

      res.status(200).send({
         status: 200,
         message: "Updated",
         data: updatedCustomer
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};