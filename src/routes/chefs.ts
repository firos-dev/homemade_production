import express from "express";
import chefsController from "../controllers/chefs-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post('/api/chef',auth, chefsController.createChef)
router.get('/api/chefs',auth, chefsController.getChefs)
export {router as chefsRouter}