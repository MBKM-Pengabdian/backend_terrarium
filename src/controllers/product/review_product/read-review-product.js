import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Retrieve reviews by product UUID and calculate average rating
export const getReviewByUuidProduct = async (req, res) => {
   try {
      const { product_id } = req.params;

      const resultReview = await prisma.review.findMany({
         where: { product_id: product_id },
         include: {
            product: true,
            customer: {
               select: {
                 uuid: true,
                 username: true,
                 email: true,
                 phone: true,
                 address: true,
               },
             },
         },
      });

      if (!resultReview || resultReview.length === 0) {
         return res.status(404).json({ error: 'Review tidak ditemukan' });
      }

      const totalRating = resultReview.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / resultReview.length;

      res.status(200).send({
         status: 200,
         message: "Success",
         data: {
            reviews: resultReview,
            averageRating: averageRating.toFixed(2) // Round to 2 decimal places
         }
      });

   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};

export const getReviewByUuidProductAdmin = async (req, res) => {
   try {
      const { product_id } = req.params;

      const resultReview = await prisma.review.findMany({
         where: { product_id: product_id },
         include: {
            product: true,
            customer: {
               select: {
                 uuid: true,
                 username: true,
                 email: true,
                 phone: true,
                 address: true,
               },
             },
         },
         orderBy: {
            created_at: "desc", // Urutkan berdasarkan created_at secara asc
          },
      });

      if (!resultReview || resultReview.length === 0) {
         return res.status(404).json({ error: 'Review tidak ditemukan' });
      }

      const totalRating = resultReview.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / resultReview.length;

      res.status(200).send({
         status: 200,
         message: "Success",
         data: {
            reviews: resultReview,
            averageRating: averageRating.toFixed(2) // Round to 2 decimal places
         }
      });

   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
