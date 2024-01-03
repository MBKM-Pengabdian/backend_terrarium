import express from "express";
import { login } from "../controllers/auth/auth_customer/login.js";
import { logout } from "../controllers/auth/auth_customer/logout.js";
import { register } from "../controllers/auth/auth_customer/register.js";
import { refreshToken } from "../controllers/auth/auth_customer/refreshToken.js";

const authCustomerRouter = express.Router();

authCustomerRouter.post('/login', login);
authCustomerRouter.put('/register', register);
authCustomerRouter.delete('/logout', logout);
authCustomerRouter.put('/refresh', refreshToken);

export default authCustomerRouter;