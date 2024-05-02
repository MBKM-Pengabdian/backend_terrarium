import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getConfigMailer = async () => {
  try {
    const response = await prisma.config_perusahaan.findFirst();
    return {
      email: response.email_mailer,
      password: response.password_mailer,
      logo: response.logo_prsh,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
