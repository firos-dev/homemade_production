import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import cuisineController from "../controllers/cuisines-controller";

router.post("/api/cuisine", auth, cuisineController.createCuisine);
router.get("/api/cuisines", auth, cuisineController.getCuisines);
router.get("/api/cuisine/items", auth, cuisineController.getCuisineItems);
export { router as cuisineRouter };
