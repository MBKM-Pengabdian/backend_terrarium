import express from "express";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { register } from "../controllers/auth/register.js";
import { refreshToken } from "../controllers/auth/refreshToken.js";

const authRouter = express.Router();

authRouter.post('/api/auth/login', login);
authRouter.put('/api/auth/register', register);
authRouter.delete('/api/auth/logout', logout);
authRouter.put('/api/auth/refresh', refreshToken);

export default authRouter;