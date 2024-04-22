import bycrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { validateUsername } from "../../../utils/validation.js";
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";

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

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "putramhmmd22@gmail.com",
          pass: "nqtn lkuj zzix zdka",
        },
      });

      const templateString = fs.readFileSync(
        "./src/receipt/confirm-account.ejs",
        "utf-8"
      );

      const data = {
        email: email,
        verify: `${process.env.CLIENT_SIDE}/verify-email/${resRegist.uuid}`
      };
      const html = ejs.render(templateString, data);

      const mailOption = {
        from: "putramhmmd22@gmail.com",
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
