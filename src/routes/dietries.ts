import express from "express";
import dietriesController from "src/controllers/dietries-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/dietry", auth, dietriesController.createDietry);
router.get("/api/cuisine", auth, dietriesController.getDietries);
export { router as dietriesRouter };
