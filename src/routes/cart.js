import express from 'express';
import { checkJWTAdmin, checkJWTCustomer, checkJWTSuperAdmin } from '../middleware/jwt.js';
import { getAllCartByIdCustomer, getAllCartCustomer } from '../controllers/cart/cart_crud/read-cart.js';
import { storeCart } from '../controllers/cart/cart_crud/create-cart.js';
import { deleteCart } from '../controllers/cart/cart_crud/delete-cart.js';
import { increaseQuantity, decreaseQuantity } from '../controllers/cart/cart_count_quantity/cart_count_quantity.js';
import { sendNotifCartCustomer } from '../controllers/cart/cart_send_notif/send-notif.js';
import { checkPromoCode } from '../controllers/cart/promo_code/read.js';

const cartRouter = express.Router();

cartRouter.get('/get/', checkJWTAdmin,checkJWTSuperAdmin, getAllCartCustomer);
cartRouter.get('/get/:customer_id', checkJWTCustomer, getAllCartByIdCustomer);
cartRouter.post('/check-promo-code', checkJWTCustomer, checkPromoCode);
cartRouter.post('/store', checkJWTCustomer, storeCart);
cartRouter.post('/send-notif', checkJWTAdmin, checkJWTSuperAdmin, sendNotifCartCustomer);
cartRouter.delete('/delete/:uuid', checkJWTCustomer, deleteCart);

// cart count 
cartRouter.post('/increase/:cartId', checkJWTCustomer, increaseQuantity)
cartRouter.post('/decrease/:cartId', checkJWTCustomer, decreaseQuantity)

export default cartRouter;
