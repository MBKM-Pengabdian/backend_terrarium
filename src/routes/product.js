import express from "express";
import { createProduct } from "../controllers/product/create.js";

const productRouter = express.Router();

productRouter.post('/api/product/store', createProduct);

export default productRouter;