import bycrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { validateUsername } from "../../../utils/validation.js";
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";
import { getConfigMailer } from "../../config_perusahaan/get-config-mailer.js";

export const register = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const { username, password, email, phone, address } = req.body;
    const checkUsername = validateUsername(username);

    if (!checkUsername) {
      return res.status(403).send({
        message: `Username Tidak Valid (Tanpa Spasi dan Semua Huruf Kecil)`,
      });
    }

    if (checkUsername === null || email === null) {
      return res.status(500).send({
        message: "Username dan email wajib diisi!",
      });
    }

    // Check If Theres User With Given Username
    const getUserByUsername = await prisma.customer.findFirst({
      where: {
        username,
      },
    });

    const existEmailCustomer = await prisma.customer.findUnique({
      where: {
        email: email,
      },
    });

    if (existEmailCustomer !== null) {
      return res.status(500).send({
        message: "Email Sudah dipakai",
      });
    }

    // If No Then Good To Go
    if (getUserByUsername === null) {
      const hashedPassword = bycrypt.hashSync(password, 10);

      const resRegist = await prisma.customer.create({
        data: {
          email: email,
          username: username,
          phone: phone,
          address: address,
          password: hashedPassword,
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

      const templateString = fs.readFileSync(
        "./src/receipt/confirm-account.ejs",
        "utf-8"
      );

      const data = {
        email: email,
        verify: `${process.env.CLIENT_SIDE}/activated-email/${resRegist.uuid}`,
      };
      const html = ejs.render(templateString, data);

      const mailOption = {
        from: partsMail.email,
        to: email,
        subject: "Konfirmasi Akun",
        html: html,
      };

      await transporter.sendMail(mailOption);

      return res.status(201).send({
        status: 201,
        message: `SUCCESS`,
      });
    }

    return res.status(409).send({
      message: "Username Already Exist",
    });
  } catch (error) {
    return res.status(500).send({
      message: "An Error Has Occured",
    });
  }
};
export const activateAccount = async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const { idcustomer } = req.params;

    const existCustomer = await prisma.customer.findUnique({
      where: {
        uuid: idcustomer,
      },
    });

    if (existCustomer == null) {
      return res.status(500).send({
        message: "Pelanggan tidak ditemukan",
      });
    }

    const activatedAccount = await prisma.customer.update({
      where: { uuid: idcustomer },
      data: { status_customer: true },
    });

    res.json({
      status: 200,
      message: "Akun berhasil diaktifkan",
    });
  } catch {
    return res.status(500).send({
      message: "Terjadi Kesalahan",
    });
  }
};
