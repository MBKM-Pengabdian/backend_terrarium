import express from "express";
import { login } from "../controllers/auth/auth_customer/login.js";
import { logout } from "../controllers/auth/auth_customer/logout.js";
import { activateAccount, register } from "../controllers/auth/auth_customer/register.js";
import { refreshToken } from "../controllers/auth/auth_customer/refreshToken.js";
import { changePassword, requestPasswordReset, resetPassword, verifyPasswordResetToken } from "../controllers/auth/auth_customer/reset-password.js";
import { checkJWTCustomer } from "../middleware/jwt.js";

const authCustomerRouter = express.Router();

authCustomerRouter.post('/login', login);
authCustomerRouter.post('/activated-email/:idcustomer', activateAccount);
authCustomerRouter.put('/register', register);
authCustomerRouter.delete('/logout', logout);
authCustomerRouter.put('/refresh', refreshToken);
authCustomerRouter.post('/request-reset-password', requestPasswordReset);
authCustomerRouter.post('/verify-reset-token', verifyPasswordResetToken);
authCustomerRouter.post('/reset-password', resetPassword);
authCustomerRouter.post('/change-password', changePassword, checkJWTCustomer);

export default authCustomerRouter;