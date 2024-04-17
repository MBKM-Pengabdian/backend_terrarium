import express from "express";
import { checkJWTAdmin, checkJWTSuperAdmin } from "../middleware/jwt.js";
import { createProduct, upload } from "../controllers/product/crud_product/create.js";
import { updateProduct } from "../controllers/product/crud_product/update.js";
import { deleteProduct } from "../controllers/product/crud_product/delete.js";
import { getAllProduct, getAllProductActive, getProductById } from "../controllers/product/crud_product/read.js";

const productRouter = express.Router();

productRouter.get('/get', getAllProduct);
productRouter.get('/getActive', getAllProductActive);
productRouter.get('/get/:productId', getProductById)
productRouter.post('/store', checkJWTAdmin, checkJWTSuperAdmin, upload.single('product_image'), createProduct);
productRouter.put('/update/:productId', checkJWTAdmin, checkJWTSuperAdmin, updateProduct);
productRouter.delete('/delete/:productId', checkJWTAdmin, checkJWTSuperAdmin, deleteProduct)

export default productRouter;