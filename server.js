import cors from 'cors';
import express from 'express';
import config from './src/config/app.js';
import authRouter from './src/routes/auth.js';
import productRouter from './src/routes/product.js';
import customerRouter from './src/routes/customers.js';
import userRouter from './src/routes/user.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/customer', customerRouter)

app.listen(config.APP_PORT, () => {
   console.log(`Server Activated On Port ${config.APP_PORT}`);
});