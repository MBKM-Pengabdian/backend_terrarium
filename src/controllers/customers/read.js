import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Retrieve all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        uuid: true,
        username: true,
        email: true,
        password: true,
        phone: true,
        address: true,
        created_at: true,
        status_customer: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    res.status(200).send({
      status: 200,
      message: "OK",
      data: customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve a single customer by UUID
export const getCustomerByIdforAdmin = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { uuid: customerId },
      include: {
        Register_Event: {
          include: {
            event: {
              include: {
                detail_event: true,
              },
            },
          },
        },
        order: {
          include: {
            order_item: {
              include:{
                product: true
              }
            },
            customer: true
          }
        },
        Special_Request: true,
        Cart: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer tidak ditemukan" });
    }

    res.status(200).send({
      status: 200,
      message: "OK",
      data: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { uuid: customerId },
      include: {
        Register_Event: {
          include: {
            event: {
              include: {
                detail_event: true,
              },
            },
          },
        },
        order: {
          include: {
            order_item: {
              include:{
                product: true
              }
            },
            customer: true
          }
        },
        Special_Request: true,
        Cart: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer tidak ditemukan" });
    }

    res.status(200).send({
      status: 200,
      message: "OK",
      data: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
