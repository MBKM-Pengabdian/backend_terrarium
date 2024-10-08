import express from "express";
import { checkJWTCustomer, checkJWTSuperAdmin, checkJWTAdmin } from "../middleware/jwt.js";
import { registerEvent, sendReminderEmailEvent, sendReminderPayEvent, sendReminderUpdatedEvent, sendTicketEvent } from "./../controllers/register_event/create.js";
import { getRegistrationEventUser, getAllRegistrationEvent, getRegistrationPaymentUser, getAllRegistrationByIdEvent } from "./../controllers/register_event/read.js";
import { updateStatusRegistrationEvent, upload, uploadBuktiBayarEvent } from "../controllers/register_event/update.js";

const RegisterEventRouter = express.Router();

RegisterEventRouter.get('/register-event/get', checkJWTSuperAdmin, checkJWTAdmin, getAllRegistrationEvent);
RegisterEventRouter.get('/register-event/:uuid_customer/get', checkJWTCustomer, getRegistrationEventUser);
RegisterEventRouter.get('/register-payment/:uuid_customer/get', checkJWTCustomer, getRegistrationPaymentUser);
RegisterEventRouter.get('/register-by-eventID/:idEvent/get', checkJWTAdmin, getAllRegistrationByIdEvent);
RegisterEventRouter.post('/upload-bukti-bayar/:regisEventID/store', checkJWTCustomer, upload, uploadBuktiBayarEvent);
RegisterEventRouter.post('/update-status/:regisEventID', checkJWTAdmin, updateStatusRegistrationEvent);
RegisterEventRouter.post('/register-event/store', checkJWTCustomer, registerEvent);
RegisterEventRouter.post('/reminder-event/:idEvent', checkJWTAdmin, sendReminderEmailEvent);
RegisterEventRouter.post('/reminder-event-updated/:idEvent', checkJWTAdmin, sendReminderUpdatedEvent);
RegisterEventRouter.post('/reminder-pay-event/:regisEventID', checkJWTAdmin, sendReminderPayEvent);
RegisterEventRouter.post('/send-ticket-event/:regisEventID', checkJWTAdmin, sendTicketEvent);

export default RegisterEventRouter;