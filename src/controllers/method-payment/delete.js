import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Delete a method pay
export const deleteMethodPay = async (req, res) => {
   const { methodPayId } = req.params;
   // Check if the method pay exists
   const existingMethodPay = await prisma.method_Payment.findUnique({
      where: { uuid: methodPayId },
   });

   if (!existingMethodPay) {
      return res.status(404).send({
         status: 404,
         message: "Method Pay not found",
      });
   }

   // Delete the method pay
   const deletedMethodPay = await prisma.method_Payment.delete({
      where: { uuid: methodPayId },
   });

   res.status(200).send({
      status: 200,
      message: "Method Payment successfully deleted",
   });
};
