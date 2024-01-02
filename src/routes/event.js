import express from "express";
import { checkJWTAdmin, checkJWTSuperAdmin } from "../middleware/jwt.js";
import { createEvent } from "../controllers/event/create.js";
import { updateEvent } from "../controllers/event/update.js";
import { deleteEvent } from "../controllers/event/delete.js";
import { getAllEvent, geteventById } from "../controllers/event/read.js";

const EventRouter = express.Router();

EventRouter.get('/get', getAllEvent);
EventRouter.get('/get/:eventId', geteventById)
EventRouter.post('/store', checkJWTAdmin, checkJWTSuperAdmin, createEvent);
EventRouter.put('/update/:eventId', checkJWTAdmin, checkJWTSuperAdmin, updateEvent);
EventRouter.delete('/delete/:eventId', checkJWTAdmin, checkJWTSuperAdmin, deleteEvent)

export default EventRouter;