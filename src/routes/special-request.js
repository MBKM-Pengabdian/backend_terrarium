import express from "express";
import { checkJWTAdmin, checkJWTSuperAdmin, checkJWTCustomer } from "../middleware/jwt.js";
import { createSpecialRequest } from "../controllers/special_request/create.js";
import { getAllSpecialReq, getAllSpecialReqFromUuidCustomer } from "../controllers/special_request/read.js";
import { updateStatusSpecialRequest } from "../controllers/special_request/update.js";

const specialRequestRoute = express.Router();

specialRequestRoute.get('/get', checkJWTAdmin, checkJWTSuperAdmin, getAllSpecialReq);
specialRequestRoute.get('/:uuid_customer/get', checkJWTCustomer, getAllSpecialReqFromUuidCustomer);
specialRequestRoute.post('/store', checkJWTCustomer, createSpecialRequest);
specialRequestRoute.post('/updateStatus/:specialReqID', checkJWTCustomer, updateStatusSpecialRequest)


export default specialRequestRoute;