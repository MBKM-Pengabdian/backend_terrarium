import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

// Fungsi untuk mendapatkan semua order untuk seorang customer
export const getOrderProductsByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const orders = await prisma.order_Product.findMany({
      where: { customer_id: customer_id },
      include: {
        order_item: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    res.status(200).json({
      status: 200,
      message: "List Order Customer",
      data: orders,
    });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fungsi untuk mendapatkan semua order
export const getAllOrder = async (req, res) => {
  try {
    const orders = await prisma.order_Product.findMany({
      include: {
        order_item: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    res.status(200).json({
      status: 200,
      message: "List Order Customer",
      data: orders,
    });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
