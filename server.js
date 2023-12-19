import cors from 'cors';
import express from 'express';
import config from './src/config/app.js';
import authRouter from './src/routes/authUser.js';
import authCustomerRouter from './src/routes/authCustomer.js';
import productRouter from './src/routes/product.js';
import customerRouter from './src/routes/customers.js';
import userRouter from './src/routes/user.js';
import EventRouter from './src/routes/event.js';
import BannerRouter from './src/routes/banner.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth/user', authRouter);
app.use('/api/auth/customer', authCustomerRouter);
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/customer', customerRouter)
app.use('/api/event', EventRouter)
app.use('/api/banner', BannerRouter)

app.listen(config.APP_PORT, () => {
   console.log(`Server Activated On Port ${config.APP_PORT}`);
});