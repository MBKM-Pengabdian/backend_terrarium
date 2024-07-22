import express from 'express';
import { checkJWTAdmin, checkJWTCustomer, checkJWTSuperAdmin } from '../middleware/jwt.js';
import { checkPromoCode, getAllPromoCodes } from '../controllers/promo_code/read.js';
import { deletePromoCode } from '../controllers/promo_code/delete.js';

const promoCodeRouter = express.Router();

promoCodeRouter.get('/get/', checkJWTAdmin,checkJWTSuperAdmin, getAllPromoCodes);
promoCodeRouter.post('/check-promo-code', checkJWTCustomer, checkPromoCode);
promoCodeRouter.delete('/delete/:id_codepromo', checkJWTAdmin, checkJWTSuperAdmin, deletePromoCode);

export default promoCodeRouter;
