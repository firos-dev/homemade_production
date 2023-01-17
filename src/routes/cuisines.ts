import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import cuisineController from "../controllers/cuisines-controller" 

router.post('/api/cuisine',auth, cuisineController.createCuisine)
router.get('/api/cuisine',auth, cuisineController.getCuisines)
export {router as cuisineRouter}