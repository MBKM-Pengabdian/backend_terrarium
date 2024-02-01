import express from "express";
import { checkJWTCustomer } from "../middleware/jwt.js";
import { createReview } from "../controllers/product/review_product/create-review-product.js";

const reviewProductRouter = express.Router();

reviewProductRouter.post('/store', checkJWTCustomer, createReview);


export default reviewProductRouter;