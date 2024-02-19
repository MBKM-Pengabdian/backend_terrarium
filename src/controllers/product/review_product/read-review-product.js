import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Retrieve a single product by UUID
export const getReviewByUuidProduct = async (req, res) => {
   try {
      const { product_id } = req.params;

      const product = await prisma.product.findUnique({
         where: { uuid: product_id },
         include: {
            review: true,
         },
      });

      if (!product) {
         return res.status(404).json({ error: 'Review tidak ditemukan' });
      };

      const reviews = product.review;

      res.status(200).send({
         status: 200,
         message: "Success",
         data: reviews
      });

   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};