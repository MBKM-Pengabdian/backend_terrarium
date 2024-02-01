import cors from 'cors';
import express from 'express';
import config from './src/config/app.js';
import multer from 'multer';
import authRouter from './src/routes/auth-user.js';
import authCustomerRouter from './src/routes/auth-customer.js';
import productRouter from './src/routes/product.js';
import customerRouter from './src/routes/customers.js';
import userRouter from './src/routes/user.js';
import EventRouter from './src/routes/event.js';
import RegisterEventRouter from './src/routes/register-event.js';
import BannerRouter from './src/routes/banner.js';
import reviewProductRouter from './src/routes/review-product.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('images'))
app.use(express.urlencoded({ extended: true }));


/**
 * Router
 */
app.use('/api/auth/user', authRouter);
app.use('/api/auth/customer', authCustomerRouter);
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/review', reviewProductRouter)
app.use('/api/customer', customerRouter)
app.use('/api/event', EventRouter)
app.use('/api/event', RegisterEventRouter)
app.use('/api/banner', BannerRouter)

app.listen(config.APP_PORT, () => {
   console.log(`Server Activated On Port ${config.APP_PORT}`);
});