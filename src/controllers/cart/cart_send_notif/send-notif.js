import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";
import ejs from "ejs";
import { getConfigMailer } from "../../config_perusahaan/get-config-mailer.js";

export const sendNotifCartCustomer = async (req, res) => {
  try {
    const {
      title_subject,
      deskripsi_pesan,
      with_promo_code,
      promo_code,
      discount_value,
      expiry_date,
      is_single_use,
    } = req.body;

    // Ambil data keranjang termasuk informasi pelanggan
    const resCart = await prisma.cart.findMany({
      include: {
        customer: true,
        product: true,
      },
    });

    let promoData = null;

    //cek apakah dengan promo
    if (with_promo_code) {
      // Periksa apakah kode promo sudah ada
      const existingPromo = await prisma.promo_Code.findUnique({
        where: { code: promo_code },
      });

      if (existingPromo) {
        return res.status(400).json({
          status: 400,
          message: "Promo code already exists",
        });
      }

      // Ambil UUID pelanggan dari keranjang
      const allowedCustomerIds = [...new Set(resCart.map((cart) => cart.customer.uuid))];
      const usageLimit = allowedCustomerIds.length;

      // Buat dan simpan kode promo
      promoData = await prisma.promo_Code.create({
        data: {
          code: promo_code,
          discount_value: parseFloat(discount_value),
          expiry_date: new Date(expiry_date),
          usage_limit: usageLimit,
          isSingleUse: is_single_use || false,
          allowed_customer_ids: JSON.stringify(allowedCustomerIds),
        },
      });
    }

    const partsMail = await getConfigMailer();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: partsMail.email,
        pass: partsMail.password,
      },
    });

    // Gunakan template EJS untuk email jika diperlukan
    const templateString = `
    <html>
    <body>
      <p>${deskripsi_pesan}</p>
      ${
        with_promo_code && promo_code
          ? `<p>Gunakan kode promo ini untuk mendapatkan diskon: <strong>${promo_code}</strong></p>`
          : ""
      }
    </body>
    </html>
  `;

    // Set untuk melacak pelanggan yang telah dikirim email
    const sentEmails = new Set();

    // Kirim email ke setiap pelanggan
    for (const dataResult of resCart) {
      const { customer } = dataResult;

      // Periksa apakah email sudah pernah dikirim ke pelanggan ini
      if (!sentEmails.has(customer.email)) {
        const html = ejs.render(templateString, { deskripsi_pesan, promo_code });

        const mailOption = {
          from: partsMail.email,
          to: customer.email,
          subject: title_subject,
          html: html,
        };

        try {
          await transporter.sendMail(mailOption);
          console.log("Email sent successfully to:", customer.email);

          // Tandai bahwa email sudah dikirim ke pelanggan ini
          sentEmails.add(customer.email);
        } catch (error) {
          console.error("Error sending email to:", customer.email, error);
        }
      }
    }

    res.status(201).json({
      status: 201,
      message: "Email successfully sent",
      promoCode: promoData,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};