import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Read all method pay
export const getAllMethodPay = async (req, res) => {
  try {
    const responseMethod = await prisma.method_Payment.findMany();
    res.status(200).send({
      status: 200,
      message: "OK",
      data: responseMethod,
    });
  } catch (error) {
    console.log(error);
  }
};

// Read detail method pay
export const getMethodPayById = async (req, res) => {
  const { methodPayId } = req.params;
  try {
    const responseMethod = await prisma.method_Payment.findMany({
      where: {
        uuid: methodPayId,
      },
    });
    res.status(200).send({
      status: 200,
      message: "OK",
      data: responseMethod,
    });
  } catch (error) {
    console.log(error);
  }
};
