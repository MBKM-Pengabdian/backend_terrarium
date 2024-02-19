import express from "express";
import { checkJWTAdmin, checkJWTSuperAdmin, checkJWTCustomer } from "../middleware/jwt.js";
import { createSpecialRequest } from "../controllers/special_request/create.js";
import { getAllSpecialReq } from "../controllers/special_request/read.js";

const specialRequestRoute = express.Router();

specialRequestRoute.get('/get', checkJWTAdmin, checkJWTSuperAdmin, getAllSpecialReq);
specialRequestRoute.post('/store', checkJWTCustomer, createSpecialRequest);


export default specialRequestRoute;