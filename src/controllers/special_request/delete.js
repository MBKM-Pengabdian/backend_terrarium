import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Delete a special request
export const deleteSpecialRequest = async (req, res) => {
   const { specialReqID } = req.params;
   // Check if the special request exists
   const existingSpecialRequest = await prisma.special_Request.findUnique({
      where: { uuid: specialReqID },
   });

   if (!existingSpecialRequest) {
      return res.status(404).send({
         status: 404,
         message: "special request not found",
      });
   }

   // Delete the special request
   const deletedMSpecialRequest = await prisma.special_Request.delete({
      where: { uuid: specialReqID },
   });

   res.status(200).send({
      status: 200,
      message: "special request successfully deleted",
   });
};
