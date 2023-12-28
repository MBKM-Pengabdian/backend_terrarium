import express from "express";
import { checkJWTAdmin, checkJWTSuperAdmin } from "../middleware/jwt.js";
import { createProduct, upload } from "../controllers/product/create.js";
import { updateProduct } from "../controllers/product/update.js";
import { deleteProduct } from "../controllers/product/delete.js";
import { getAllProduct, getProductById } from "../controllers/product/read.js";

const productRouter = express.Router();

productRouter.get('/get', checkJWTAdmin, checkJWTSuperAdmin, getAllProduct);
productRouter.get('/get/:productId', checkJWTAdmin, checkJWTSuperAdmin, getProductById)
productRouter.post('/store', checkJWTAdmin, checkJWTSuperAdmin, upload.single('product_image'), createProduct);
productRouter.put('/update/:productId', checkJWTAdmin, checkJWTSuperAdmin, updateProduct);
productRouter.delete('/delete/:productId', checkJWTAdmin, checkJWTSuperAdmin, deleteProduct)

export default productRouter;