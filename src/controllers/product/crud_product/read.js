import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Read all products
export const getAllProduct = async (req, res) => {
   try {
      const products = await prisma.product.findMany();

      res.status(200).send({
         status: 200,
         message: "OK",
         data: products,
      });
   } catch (error) {
      console.log(error);
   }
};

// Read a specific product
export const getProductById = async (req, res) => {
   try {
      const { productId } = req.params;

      const product = await prisma.product.findUnique({
         where: { uuid: productId },
      });

      const reviews = await prisma.riview.findMany({
         where: { product_id: productId },
      });

      if (!product) {
         return res.status(404).json({
            status: 404,
            message: "Product Not Found"
         });
      }

      res.status(200).send({
         status: 200,
         message: "OK",
         data: {
            product,
            reviews
         }
      });
   } catch (error) {
      console.log(error);
   }
};
