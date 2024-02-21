import express from 'express';
import { checkJWTCustomer } from '../middleware/jwt.js';
import { getAllCart } from '../controllers/cart/cart_crud/read-cart.js';
import { storeCart } from '../controllers/cart/cart_crud/create-cart.js';
import { deleteCart } from '../controllers/cart/cart_crud/delete-cart.js';
import { increaseQuantity, decreaseQuantity } from '../controllers/cart/cart_count_quantity/cart_count_quantity.js';

const cartRouter = express.Router();

cartRouter.get('/get/:customer_id', checkJWTCustomer, getAllCart);
cartRouter.post('/store', checkJWTCustomer, storeCart);
cartRouter.delete('/delete/:uuid', checkJWTCustomer, deleteCart);

// cart count 
cartRouter.post('/increase/:cartId', checkJWTCustomer, increaseQuantity)
cartRouter.post('/decrease/:cartId', checkJWTCustomer, decreaseQuantity)

export default cartRouter;
