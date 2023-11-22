import express from "express";
import { createProduct } from "../controllers/product/create.js";
import { updateProduct } from "../controllers/product/update.js";
import { deleteProduct } from "../controllers/product/delete.js";
import { getAllProduct, getProductById } from "../controllers/product/read.js";

const productRouter = express.Router();

productRouter.get('/get', getAllProduct);
productRouter.get('/get/:productId', getProductById)
productRouter.post('/store', createProduct);
productRouter.put('/update/:productId', updateProduct);
productRouter.delete('/delete/:productId', deleteProduct)

export default productRouter;