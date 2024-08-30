import { PrismaClient } from '@prisma/client';
import pkg from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import bcrypt from "bcryptjs";
import config from '../../../config/app.js';
import { getConfigMailer } from '../../config_perusahaan/get-config-mailer.js';

const prisma = new PrismaClient();
const { sign } = pkg;
const { verify } = pkg;

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        // Cari customer berdasarkan email
        const customer = await prisma.customer.findUnique({ where: { email } });

        // Jika customer tidak ditemukan, kirim respon 404
        if (!customer) {
            return res.status(404).json({status: 404, message: 'Email not found' });
        }

        // Buat token reset password
        const resetToken = sign({ uuid: customer.uuid }, config.RESET_PASSWORD_SECRET, { expiresIn: 60*10 });
        
        // Tautan reset password menggunakan environment variable SERVER_SIDE
        const resetLink = `${process.env.CLIENT_SIDE}/new-password?token=${resetToken}`;

        // Konfigurasi transporter untuk nodemailer
        const partsMail = await getConfigMailer();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: partsMail.email,
                pass: partsMail.password,
            },
        });

        // Template email untuk reset password
        const templateString = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                        line-height: 1.6;
                    }
                    .container {
                        width: 80%;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h2 {
                        color: #4CAF50;
                    }
                    a {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin-top: 10px;
                    }
                    a:hover {
                        background-color: #45a049;
                    }
                    .footer {
                        margin-top: 20px;
                        color: #777;
                        font-size: 0.9em;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Permintaan Reset Password</h2>
                    <p>Halo,</p>
                    <p>Anda telah meminta untuk mereset password akun Anda. Jika Anda merasa tidak pernah melakukan permintaan ini, Anda dapat mengabaikan email ini dengan aman.</p>
                    <div>Untuk mereset password Anda, silakan klik link berikut:</div>
                    <a href="<%= resetLink %>">Reset Password</a>
                    <p>Link ini hanya berlaku selama 1 jam. Setelah itu, Anda perlu melakukan permintaan reset password kembali.</p>
                    <div>Terima kasih,</div>
                    <div>Tim Support</div>
                    <div class="footer">
                        <p>&copy; 2024 Cacti Life. Semua hak dilindungi.</p>
                    </div>
                </div>
            </body>
        </html>
        `;


        // Render template dengan ejs
        const html = ejs.render(templateString, { resetLink });

        // Opsi email yang akan dikirim
        const mailOption = {
            from: partsMail.email,
            to: email,
            subject: "Konfirmasi Reset Password",
            html: html,
        };

        // Kirim email
        await transporter.sendMail(mailOption);

        // Respon sukses
        res.status(200).json({status: 200, message: 'Reset password link has been sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};


export const verifyPasswordResetToken = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = verify(token, config.RESET_PASSWORD_SECRET);
        const customer = await prisma.customer.findUnique({ where: { uuid: decoded.uuid } });
        if (!customer || customer.resetTokenUsed || customer.resetTokenExpires < new Date()) {
            return res.status(400).json({ status: 400, message: 'Token tidak valid atau telah kedaluwarsa' });
        }
        return res.status(200).json({ status: 200, message: 'Token valid', uuid: decoded.uuid });
    } catch (error) {
        return res.status(400).json({ status: 400, message: 'Token tidak valid atau telah kedaluwarsa' });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password_baru } = req.body;

    try {
        const decoded = verify(token, config.RESET_PASSWORD_SECRET);
        const hashedPassword = await bcrypt.hash(password_baru, 10);

        await prisma.customer.update({
            where: { uuid: decoded.uuid },
            data: { password: hashedPassword },
        });

        res.status(200).json({ status: 200, message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 400, message: 'Invalid or expired token' });
    }
};

export const changePassword = async (req, res) => {
    const { id_customer, password_baru } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password_baru, 10);

        await prisma.customer.update({
            where: { uuid: id_customer },
            data: { password: hashedPassword },
        });

        res.status(200).json({ status: 200, message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 400, message: 'Invalid or expired token' });
    }
};