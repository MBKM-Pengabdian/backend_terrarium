import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Read all Review
export const getAllReviewProduct = async (req, res) => {
  const resultReview = await prisma.review.findMany({
    include: {
      customer: true,
      product: true,
    },
  });

  res.status(200).json({
    status: 200,
    message: "OK",
    data: resultReview,
  });
};

// Read a specific Review by product
export const getAllReviewProductByProduct = async (req, res) => {
  const { productId } = req.params;
  const resultReview = await prisma.review.findUnique({
    where: {
      product_id: productId,
    },
    include: {
      customer: true,
      product: true,
    },
  });

  if (!resultReview) {
    return res.status(404).json({
      error: "product not found",
    });
  }

  res.status(200).send({
    status: 200,
    message: "OK",
    data: resultReview,
  });
};
