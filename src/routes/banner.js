import express from "express";
import {
    getAllBanner,
    getBannerByPriorityActive
} from "../controllers/banner/read.js";
import {
    createBanner
} from "../controllers/banner/create.js";
import {
    updateBanner
} from "../controllers/banner/update.js";
import {
    deleteBanner
} from "../controllers/banner/delete.js";


const BannerRouter = express.Router();

BannerRouter.get('/get', getAllBanner);
BannerRouter.get('/get/active', getBannerByPriorityActive)
BannerRouter.post('/store', createBanner);
BannerRouter.put('/update/:bannerId', updateBanner);
BannerRouter.delete('/delete/:bannerId', deleteBanner)

export default BannerRouter;