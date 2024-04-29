import express from "express";
import { checkJWTAdmin, checkJWTSuperAdmin } from "../middleware/jwt.js";
import { updateConfigPrsh, upload } from "../controllers/config_perusahaan/update.js";
import { getConfigPrsh } from "../controllers/config_perusahaan/read.js.js";

const ConfigPrshRouter = express.Router();

ConfigPrshRouter.get('/get', getConfigPrsh);
ConfigPrshRouter.put('/update', checkJWTAdmin, checkJWTSuperAdmin, upload, updateConfigPrsh);

export default ConfigPrshRouter;