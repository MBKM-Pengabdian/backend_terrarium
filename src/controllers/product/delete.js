import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Delete a product
export const deleteProduct = async (req, res) => {
   const { productId } = req.params;

   const deletedProduct = await prisma.product.delete({
      where: { uuid: productId },
   });

   res.status(200).send({
      status: 200,
      message: "Data product berhasil dihapus",
   });
};