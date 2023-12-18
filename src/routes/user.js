import express from "express";
import { checkJWTSuperAdmin, checkJWTAdmin } from "../middleware/jwt.js";
import { createUser } from "../controllers/user/create.js";
import { updateUser } from "../controllers/user/update.js";
import { deleteUser } from "../controllers/user/delete.js";
import { getAllUsers, getUserById } from "../controllers/user/read.js";

const userRouter = express.Router();

userRouter.get('/get', checkJWTSuperAdmin, checkJWTAdmin, getAllUsers);
userRouter.get('/get/:userId', checkJWTSuperAdmin, checkJWTAdmin, getUserById)
userRouter.post('/store', checkJWTSuperAdmin, createUser);
userRouter.put('/update/:userId', checkJWTSuperAdmin, updateUser);
userRouter.delete('/delete/:userId', checkJWTSuperAdmin, deleteUser)

export default userRouter;