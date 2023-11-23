import express from "express";
import { getAllUsers, getUserById } from "../controllers/user/read.js";

const userRouter = express.Router();

userRouter.get('/get', getAllUsers);
userRouter.get('/get/:userId', getUserById)

export default userRouter;