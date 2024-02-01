// routes/customerRoutes.js
import express from 'express';
import { checkJWTCustomer } from '../middleware/jwt.js';
import { getAllCart } from '../controllers/cart/read-cart.js';
import { storeCart } from '../controllers/cart/create-cart.js';
import { deleteCart } from '../controllers/cart/delete-cart.js';

const cartRouter = express.Router();

cartRouter.get('/get/:customer_id', checkJWTCustomer, getAllCart);
cartRouter.post('/store', checkJWTCustomer, storeCart);
cartRouter.delete('/delete/:uuid', checkJWTCustomer, deleteCart);

export default cartRouter;
