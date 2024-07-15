import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import { getConfigMailer } from "../../config_perusahaan/get-config-mailer.js";

export const sendNotifCartCustomer = async (req, res) => {
  try {
    const { deskripsi_pesan } = req.body;

    const resCart = await prisma.cart.findMany({
      include: {
        customer: true,
        product: true,
      },
    });

    const partsMail = await getConfigMailer();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: partsMail.email,
        pass: partsMail.password,
      },
    });

    // Gunakan template EJS untuk email jika diperlukan
    const templateString = `<html><body>${deskripsi_pesan}</body></html>`; // Gantilah dengan template EJS yang Anda inginkan

    resCart.forEach(async (dataResult) => {
      const { customer } = dataResult;

      const html = ejs.render(templateString, { deskripsi_pesan });

      const mailOption = {
        from: partsMail.email,
        to: customer.email,
        subject: "Cacti Life: Ayo Checkout barang mu buruan!",
        html: deskripsi_pesan,
      };

      try {
        await transporter.sendMail(mailOption);
        console.log("Email sent successfully to:", customer.email);
      } catch (error) {
        console.error("Error sending email to:", customer.email, error);
      }
    });

    res.status(200).json({
      status: 201,
      message: "Email successfully sent",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
