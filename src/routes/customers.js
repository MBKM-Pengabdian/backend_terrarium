// routes/customerRoutes.js
import express from 'express';
import { createCustomer } from '../controllers/customers/create.js';
import { getAllCustomers, getCustomerById } from '../controllers/customers/read.js';
import { updateCustomer } from '../controllers/customers/update.js';
import { deleteCustomer } from '../controllers/customers/delete.js';
import { checkJWTAdmin, checkJWTCustomer, checkJWTSuperAdmin } from '../middleware/jwt.js';

const customerRouter = express.Router();

customerRouter.get('/get',checkJWTAdmin, checkJWTSuperAdmin, getAllCustomers);
customerRouter.get('/get/:customerId/admin',checkJWTAdmin, checkJWTSuperAdmin, getCustomerById);
customerRouter.get('/get/:customerId', checkJWTCustomer, getCustomerById);
customerRouter.post('/store', createCustomer);
customerRouter.put('/update/:customerId', updateCustomer);
customerRouter.delete('/delete/:customerId', deleteCustomer);

export default customerRouter;
