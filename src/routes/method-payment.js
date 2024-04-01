import express from "express";
import { checkJWTAdmin, checkJWTSuperAdmin } from "../middleware/jwt.js";
import { getAllMethodPay, getMethodPayById } from "../controllers/method-payment/read.js";
import { createMethodPay, upload } from "../controllers/method-payment/create.js";
import { updateMethodPay } from "../controllers/method-payment/update.js";
import { deleteMethodPay } from "../controllers/method-payment/delete.js";

const methodPayRouter = express.Router();
methodPayRouter.get('/get', getAllMethodPay);
methodPayRouter.get('/get/:methodPayId', getMethodPayById);
methodPayRouter.post('/store', checkJWTAdmin, checkJWTSuperAdmin, upload, createMethodPay);
methodPayRouter.put('/update/:methodPayId', checkJWTAdmin, checkJWTSuperAdmin, upload, updateMethodPay);
methodPayRouter.delete('/delete/:methodPayId', checkJWTAdmin, checkJWTSuperAdmin, deleteMethodPay);

export default methodPayRouter;