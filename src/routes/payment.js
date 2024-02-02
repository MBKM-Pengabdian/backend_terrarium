// routes/customerRoutes.js
import express from 'express';
import { paymentMidtrans } from '../controllers/payment/payment.js';

const paymentRouter = express.Router();

paymentRouter.post('/payment', paymentMidtrans);


export default paymentRouter;
