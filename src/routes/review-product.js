import express from "express";
import { checkJWTAdmin, checkJWTCustomer, checkJWTSuperAdmin } from "../middleware/jwt.js";
import { createReview } from "../controllers/product/review_product/create-review-product.js";
import { getReviewByUuidProduct, getReviewByUuidProductAdmin } from "../controllers/product/review_product/read-review-product.js";

const reviewProductRouter = express.Router();

reviewProductRouter.get('/get/:product_id/reviews', getReviewByUuidProduct);
reviewProductRouter.get('/get/:product_id/admin', getReviewByUuidProductAdmin);
reviewProductRouter.post('/store', checkJWTSuperAdmin, checkJWTAdmin, createReview);


export default reviewProductRouter;