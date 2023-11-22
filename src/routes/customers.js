// routes/customerRoutes.js
import express from 'express';
import { createCustomer } from '../controllers/customers/create.js';
import { getAllCustomers, getCustomerById } from '../controllers/customers/read.js';
import { updateCustomer } from '../controllers/customers/update.js';
import { deleteCustomer } from '../controllers/customers/delete.js';

const customerRouter = express.Router();

customerRouter.get('/get', getAllCustomers);
customerRouter.get('/get/:customerId', getCustomerById);
customerRouter.post('/store', createCustomer);
customerRouter.put('/update/:customerId', updateCustomer);
customerRouter.delete('/delete/:customerId', deleteCustomer);

export default customerRouter;
