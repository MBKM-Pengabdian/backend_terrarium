import { PrismaClient } from '@prisma/client';
import { dateFormat } from '../../utils/date-format.js';

const prisma = new PrismaClient();

// Controller to handle request creation
export const createSpecialRequest = async (req, res) => {
   const {
      fullname,
      customer_id,
      phone_number,
      email,
      customer_city,
      cutomer_address,
      service_type,
      description,
      deadline,
      budget_estimation,
      project_location,
      photo,
   } = req.body

   try {
      const newSpecialRequest = await prisma.special_Request.create({
         data: {
            fullname,
            customer_id,
            phone_number,
            email,
            customer_city,
            cutomer_address,
            service_type,
            description,
            deadline: dateFormat(deadline),
            budget_estimation,
            project_location,
            photo,
         }
      });

      const response = {
         'customer-data': {
            customer_id,
            fullname,
            phone_number,
            email,
            customer_city,
            cutomer_address,
         },
         'special-request': {
            service_type,
            description,
            deadline: dateFormat(deadline),
            budget_estimation,
            project_location,
            photo,
         },
         created_at: newSpecialRequest.created_at.toISOString(),
      };

      res.status(201).send({
         status: 201,
         message: "Created",
         data: response
      });
   } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
   }
};