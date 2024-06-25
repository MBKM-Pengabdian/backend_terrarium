import express from "express";
import {
  getAllBanner,
  getBannerById,
  getBannerByPriorityActive,
} from "../controllers/banner/read.js";
import { createBanner, upload } from "../controllers/banner/create.js";
import { updateBanner } from "../controllers/banner/update.js";
import { deleteBanner } from "../controllers/banner/delete.js";
import { checkJWTAdmin, checkJWTSuperAdmin } from "../middleware/jwt.js";

const BannerRouter = express.Router();

BannerRouter.get("/get", checkJWTAdmin, checkJWTSuperAdmin, getAllBanner );
BannerRouter.get("/get/:bannerId", checkJWTAdmin, checkJWTSuperAdmin, getBannerById);
BannerRouter.get("/active", getBannerByPriorityActive);
BannerRouter.post("/store", checkJWTAdmin, checkJWTSuperAdmin, upload, createBanner);
BannerRouter.put("/update/:bannerId", checkJWTAdmin, checkJWTSuperAdmin, upload, updateBanner);
BannerRouter.delete("/delete/:bannerId",checkJWTAdmin, checkJWTSuperAdmin, deleteBanner);

export default BannerRouter;
