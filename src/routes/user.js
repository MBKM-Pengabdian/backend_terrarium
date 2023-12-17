import express from "express";
import { getAllUsers, getUserById } from "../controllers/user/read.js";
import { createUser } from "../controllers/user/create.js";
import { updateUser } from "../controllers/user/update.js";
import { deleteUser } from "../controllers/user/delete.js";

const userRouter = express.Router();

userRouter.get('/get', getAllUsers);
userRouter.get('/get/:userId', getUserById)
userRouter.post('/store', createUser);
userRouter.put('/update/:userId', updateUser);
userRouter.delete('/delete/:userId', deleteUser)

export default userRouter;