import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Retrieve all customers
export const getAllSpecialReq = async (req, res) => {
  try {
    const specialRequest = await prisma.special_Request.findMany();
    res.status(200).send({
      status: 200,
      message: "Success",
      data: specialRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllSpecialReqFromUuidCustomer = async (req, res) => {
  const { uuid_customer } = req.params;

  try {
    const specialRequests = await prisma.special_Request.findMany({
      where: {
        customer_id: uuid_customer,
      },
    });

    res.status(200).json({
      status: 200,
      message: "OK",
      data: specialRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSpecialReqById = async (req, res) => {
  const { specialReqID } = req.params;
  const specialRequests = await prisma.special_Request.findUnique({
    where: {
      uuid: specialReqID,
    },
  });

  if (!specialRequests) {
    return res.status(404).json({
      error: "Special Request not found",
    });
  }

  res.status(200).send({
    status: 200,
    message: "OK",
    data: specialRequests,
  });
};
