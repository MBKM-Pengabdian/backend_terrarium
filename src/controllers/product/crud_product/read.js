import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Read all products
export const getAllProduct = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        created_at: "asc",
      },
      include: {
        review: true,
      },
    });

    // Hitung averageRating untuk masing-masing product
    const productsWithAverageRating = products.map((product) => {
      const totalRating = product.review.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = product.review.length
        ? totalRating / product.review.length
        : 0;
      return {
        ...product,
        averageRating: averageRating, // Tambahkan averageRating ke dalam masing-masing product
      };
    });

    res.status(200).send({
      status: 200,
      message: "OK",
      data: productsWithAverageRating,
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

    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
    });

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product Not Found",
      });
    }

    res.status(200).send({
      status: 200,
      message: "OK",
      data: {
        product,
        reviews,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Read all products
export const getAllProductActive = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        status_product: 1,
      },
      orderBy: [
        {
          stock_quantity: "desc",
        },
        // {
        //    sold: 'desc'
        // },
      ],
      include: {
         review: true,
       },
    });
    // Hitung averageRating untuk masing-masing product
    const productsWithAverageRating = products.map((product) => {
      const totalRating = product.review.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = product.review.length
        ? totalRating / product.review.length
        : 0;
      return {
        ...product,
        averageRating: averageRating, // Tambahkan averageRating ke dalam masing-masing product
      };
    });

    res.status(200).send({
      status: 200,
      message: "OK",
      data: productsWithAverageRating,
    });
  } catch (error) {
    console.log(error);
  }
};
