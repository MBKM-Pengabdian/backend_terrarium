import express from 'express';
import authRouter from './src/routes/auth.js';
import productRouter from './src/routes/product.js';
import customerRouter from './src/routes/customers.js';
import cors from 'cors';
import config from './src/config/app.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use('/api/product', productRouter)
app.use('/api/customer', customerRouter)

app.listen(config.APP_PORT, () => {
   console.log(`Server Activated On Port ${config.APP_PORT}`);
});