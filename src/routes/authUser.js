import express from "express";
import { login } from "../controllers/auth/auth_user/login.js";
import { logout } from "../controllers/auth/auth_user/logout.js";
import { register } from "../controllers/auth/auth_user/register.js";
import { refreshToken } from "../controllers/auth/auth_user/refreshToken.js";

const authRouter = express.Router();

authRouter.post('/api/auth/login', login);
authRouter.put('/api/auth/register', register);
authRouter.delete('/api/auth/logout', logout);
authRouter.put('/api/auth/refresh', refreshToken);

export default authRouter;