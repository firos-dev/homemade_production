import express from "express";
import spicy_levelsController from "../controllers/spicy_levels-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/spicy_level", auth, spicy_levelsController.createSpicyLevel);
router.get("/api/spicy_levels", auth, spicy_levelsController.getSpicyLevels);
export { router as spicyLevelRouter };
