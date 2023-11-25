import express from "express";
import {
    getAllEvent,
    geteventById
} from "../controllers/event/read.js";
import {
    createEvent
} from "../controllers/event/create.js";
import {
    updateEvent
} from "../controllers/event/update.js";
import {
    deleteEvent
} from "../controllers/event/delete.js";

const EventRouter = express.Router();

EventRouter.get('/get', getAllEvent);
EventRouter.get('/get/:eventId', geteventById)
EventRouter.post('/store', createEvent);
EventRouter.put('/update/:eventId', updateEvent);
EventRouter.delete('/delete/:eventId', deleteEvent)

export default EventRouter;