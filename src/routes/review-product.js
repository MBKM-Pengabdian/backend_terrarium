import express from "express";
import { checkJWTCustomer } from "../middleware/jwt.js";
import { createReview } from "../controllers/product/review_product/create-review-product.js";
import { getReviewByUuidProduct } from "../controllers/product/review_product/read-review-product.js";

const reviewProductRouter = express.Router();

reviewProductRouter.get('/get/:product_id/reviews', getReviewByUuidProduct);
reviewProductRouter.post('/store', checkJWTCustomer, createReview);


export default reviewProductRouter;