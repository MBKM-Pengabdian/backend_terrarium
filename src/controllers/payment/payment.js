import MidtransClient from "midtrans-client";
import config from "../../config/app.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const paymentMidtrans = async (req, res) => {
   try {
      const {
         order_id,
         gross_amount,
         first_name,
         email,
         phone,
         address,
         price,
         quantity,
         product_id,
         customer_id,
      } = req.body;

      if (!order_id) {
         return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Initialize Midtrans client
      const snap = new MidtransClient.Snap({
         clientKey: config.CLIENT_KEY,
         serverKey: config.SERVER_KEY,
         isProduction: false,
      });

      const total_harga_product = quantity * price

      let parameter = {
         "transaction_details": {
            "order_id": order_id,
            "gross_amount": total_harga_product
         },
         "item_details": [{
            "id": product_id,
            "name": "tes",
            "price": price,
            "quantity": quantity,
         }],
         "customer_details": {
            "id": customer_id,
            "first_name": first_name,
            "email": email,
            "phone": phone,
            "address": address,

         },
      };

      // Create transaction
      const transaction = await snap.createTransaction(parameter);

      // Transaction token
      const transactionToken = transaction.token;

      // Transaction redirect URL
      const transactionRedirectUrl = transaction.redirect_url;

      const savedPayment = await prisma.payment.create({
         data: {
            customer_id: customer_id,
            product_id: product_id,
            quantity: quantity,
            total_harga: total_harga_product,
            customer_email: email,
            snap_token: transactionToken,
            snap_redirect_url: transactionRedirectUrl,
         },
      });

      // Return the transaction token and redirect URL to the client
      res.status(201).json(
         {
            status: 201,
            message: "Success",
            data_payment: {
               savedPayment
            }
         }
      );

   } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}
