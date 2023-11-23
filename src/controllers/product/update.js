import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Update a product
export const updateProduct = async (req, res) => {
   const { productId } = req.params;
   const { user_id, product_name, product_image, description, price, stock_quantity } = req.body;

   const updatedProduct = await prisma.product.update({
      where: { uuid: productId },
      data: {
         user_id,
         product_name,
         product_image,
         description,
         price,
         stock_quantity,
      },
   });

   res.status(200).send({
      status: 200,
      message: "Updated",
      data: updatedProduct
   });
};