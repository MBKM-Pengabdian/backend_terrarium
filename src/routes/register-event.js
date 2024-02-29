import express from "express";
import { checkJWTCustomer } from "../middleware/jwt.js";
import { registerEvent } from "./../controllers/register_event/create.js";
import { getAllRegistrationEvent } from "./../controllers/register_event/read.js";

const RegisterEventRouter = express.Router();

RegisterEventRouter.get('/register-event/:uuid_customer/get', checkJWTCustomer, getAllRegistrationEvent);
RegisterEventRouter.post('/register-event/store', checkJWTCustomer, registerEvent);

export default RegisterEventRouter;