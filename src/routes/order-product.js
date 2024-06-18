import express from "express";
import { checkJWTAdmin, checkJWTCustomer } from "../middleware/jwt.js";
import { getAllOrder, getOrderProductsByCustomer } from "../controllers/order_product/read.js";
import { orderProduct } from "../controllers/order_product/create.js";
import { updateStatusOrderProduct, upload, uploadBuktiBayarOrderProduct } from "../controllers/order_product/update.js";

const OrderProduct = express.Router();

OrderProduct.get('/get/',checkJWTAdmin, getAllOrder)
OrderProduct.get('/get/customer/:uuid_customer',checkJWTCustomer, getOrderProductsByCustomer)
OrderProduct.post('/store/customer', checkJWTCustomer, orderProduct);
OrderProduct.post('/upload-bukti-bayar/:orderID/store', checkJWTCustomer, upload, uploadBuktiBayarOrderProduct);
OrderProduct.post('/update-status/:orderID', checkJWTAdmin, updateStatusOrderProduct);


export default OrderProduct;