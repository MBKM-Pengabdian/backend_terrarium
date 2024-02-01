import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Delete a product
export const deleteProduct = async (req, res) => {
   const { productId } = req.params;

   // Validate that productId is a valid UUID
   if (!isValidUUID(productId)) {
      return res.status(400).send({
         status: 400,
         message: "Invalid product UUID format",
      });
   }

   // Check if the product exists
   const existingProduct = await prisma.product.findUnique({
      where: { uuid: productId },
   });

   if (!existingProduct) {
      return res.status(404).send({
         status: 404,
         message: "Product not found",
      });
   }

   // Delete the product
   const deletedProduct = await prisma.product.delete({
      where: { uuid: productId },
   });

   res.status(200).send({
      status: 200,
      message: "Product successfully deleted",
   });
};

// Function to validate UUID format
function isValidUUID(uuid) {
   const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
   return uuidRegex.test(uuid);
}
