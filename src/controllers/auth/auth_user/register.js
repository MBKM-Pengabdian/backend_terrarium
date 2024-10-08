import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { validateUsername } from '../../../utils/validation.js';

export const register = async (req, res) => {
   try {
      const prisma = new PrismaClient();
      const { username, password, email, phone, address, role } = req.body;

      const checkUsername = validateUsername(username);

      if (!checkUsername) {
         return res.status(403).send({
            status: 403,
            message: `Invalid Username (No Spaces And All Lowercase)`,
         });
      }

      if (!username || !email || !password || !phone || !address) {
         return res.status(400).send({
            status: 400,
            message: 'All fields (username, email, password, phone, address) are required.',
         });
      }

      const getUserByUsername = await prisma.user.findFirst({
         where: {
            username,
         },
      });

      if (!getUserByUsername) {
         const hashedPassword = bcrypt.hashSync(password, 10);

         await prisma.user.create({
            data: {
               role,
               email,
               username,
               phone,
               address,
               password: hashedPassword,
            },
         });

         return res.status(201).send({
            status: 201,
            message: `SUCCESS`,
         });
      }

      return res.status(409).send({
         status: 409,
         message: 'Username Already Exists',
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send({
         status: 500,
         message: 'An Error Has Occurred',
      });
   }
};

// Fungsi untuk mengatur jalannya registrasi saat server pertama kali dijalankan
export const registerOnServerStart = async () => {
   try {
      const prisma = new PrismaClient();
      const defaultUsername = 'CactiLife';
      const defaultPassword = 'Cacti#112233'; 
      const defaultEmail = '';
      const defaultPhone = '123456789';
      const defaultAddress = 'Admin Address';
      const defaultRole = 'super admin';

      // Periksa apakah user dengan username 'admin' sudah ada
      const adminUser = await prisma.user.findFirst({
         where: {
            username: defaultUsername,
         },
      });

      // Jika user 'admin' belum ada, maka buatlah akun admin
      if (!adminUser) {
         const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

         await prisma.user.create({
            data: {
               role: defaultRole,
               email: defaultEmail,
               username: defaultUsername,
               phone: defaultPhone,
               address: defaultAddress,
               password: hashedPassword,
            },
         });
      }
   } catch (error) {
      console.error('Error creating admin account:', error);
   }
};