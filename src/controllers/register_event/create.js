
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'
const prisma = new PrismaClient();

export const registerEvent = async (req, res) => {
   try {
      const { customer_id, event_id, email_customer, fullname_customer } = req.body;

      const existingRegistration = await prisma.register_Event.findFirst({
         where: {
            customer_id,
            event_id,
         },
      });

      if (existingRegistration) {
         return res.status(400).json({
            status: 400,
            message: 'Customer is already registered for the event',
         });
      }

      const generated_uuid = uuidv4();
      const split_uuid = generated_uuid.match(/.{1,4}/g);
      const token_uuid = split_uuid[0].toUpperCase();

      const registration = await prisma.register_Event.create({
         data: {
            uuid: uuidv4(),
            customer_id,
            event_id,
            email_customer,
            fullname_customer,
            token_registration: `CACTI-${token_uuid}`
         },
      });

      res.status(201).json({
         status: 201,
         message: 'Registration event successfully',
         data: registration
      });
   } catch (error) {
      console.error('Error registering event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};

