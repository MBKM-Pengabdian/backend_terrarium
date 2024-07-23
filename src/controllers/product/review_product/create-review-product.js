import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Route to create a new review
export const createReview = async (req, res) => {
   try {
     const { customerId, reviewData } = req.body;

     // Assumes you have a Prisma model set up for Review
     const reviews = await Promise.all(reviewData.map(async (item) => {
       return await prisma.review.create({
         data: {
           product_id: item.product_id,
           customer_id: customerId,
           rating: item.rating,
           comment: item.comment,
         }
       });
     }));
 
     res.status(201).json({ message: 'Reviews created successfully', reviews });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 };
 