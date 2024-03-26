import express from "express";
import { checkJWTCustomer, checkJWTSuperAdmin, checkJWTAdmin } from "../middleware/jwt.js";
import { registerEvent } from "./../controllers/register_event/create.js";
import { getRegistrationEventUser, getAllRegistrationEvent } from "./../controllers/register_event/read.js";

const RegisterEventRouter = express.Router();

RegisterEventRouter.get('/register-event/get', checkJWTSuperAdmin, checkJWTAdmin, getAllRegistrationEvent);
RegisterEventRouter.get('/register-event/:uuid_customer/get', checkJWTCustomer, getRegistrationEventUser);
RegisterEventRouter.post('/register-event/store', checkJWTCustomer, registerEvent);

export default RegisterEventRouter;