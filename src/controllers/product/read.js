import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Read all products
export const getAllProduct = async (req, res) => {
   const products = await prisma.product.findMany();
   res.status(200).send({
      status: 200,
      message: "OK",
      data: products
   });
};

// Read a specific product
export const getProductById = async (req, res) => {
   const { productId } = req.params;
   const product = await prisma.product.findUnique({
      where: { uuid: productId },
   });

   if (!product) {
      return res.status(404).json({ error: 'Product not found' });
   }

   res.status(200).send({
      status: 200,
      message: "OK",
      data: product
   });
};
