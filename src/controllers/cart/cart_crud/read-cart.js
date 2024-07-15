import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all carts Customer
export const getAllCartByIdCustomer = async (req, res) => {
  try {
    const customer_id = req.params.customer_id;

    const cart = await prisma.cart.findMany({
      where: {
        customer_id,
      },
      include: {
        product: true,
      },
      orderBy: {
        created_at: "asc", // Urutkan berdasarkan created_at secara asc
      },
    });
    res.json({
      status: 200,
      message: "Success",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get All Cart for admin
export const getAllCartCustomer = async (req, res) => {
  try {
    const cart = await prisma.cart.findMany({
      include: {
        customer: {
          select: {
            uuid: true,
            username: true,
            email: true,
            phone: true,
            address: true,
            created_at: true,
            status_customer: true,
          },
        },
        product: true, // Sertakan semua field dari product
      },
      orderBy: {
        created_at: "desc", // Urutkan berdasarkan created_at secara asc
      },
    });
    res.json({
      status: 200,
      message: "Success",
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
