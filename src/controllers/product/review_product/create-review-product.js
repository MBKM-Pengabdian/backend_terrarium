import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Route to create a new review
export const createReview = async (req, res) => {
   try {
      const { product_id, customer_id, rating, comment, img_review } = req.body;

      const newReview = await prisma.review.create({
         data: {
            product_id,
            customer_id,
            rating,
            comment,
            img_review,
         },
      });

      res.json(newReview);
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};