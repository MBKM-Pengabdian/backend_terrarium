import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRegistrationEvent = async (req, res) => {
   const { uuid_customer } = req.params;

   try {
      const registrations = await prisma.register_Event.findMany({
         where: {
            customer_id: uuid_customer,
         },
         include: {
            event: true
         },
      });

      const formattedData = registrations.map((registration) => {
         const { event } = registration;

         return {
            uuid: event.uuid,
            customer_data: {
               customer_id: registration.customer_id,
               fullname_customer: registration.fullname_customer,
               email_customer: registration.email_customer,
            },
            event_data: {
               event_id: event.uuid,
               token_registration: registration.token_registration,
               date_event: event.created_at.toISOString(),
               title_event: event.title_event,
               place: event.place,
            },
            created_at: registration.created_at.toISOString(),
         };
      });

      res.status(200).json({
         status: 200,
         message: 'OK',
         data: formattedData,
      });
   } catch (error) {
      console.error('Error getting registrations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
