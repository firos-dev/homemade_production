import express from "express";
import spicy_levelsController from "src/controllers/spicy_levels-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/dietry", auth, spicy_levelsController.createSpicyLevel);
router.get("/api/cuisine", auth, spicy_levelsController.getSpicyLevels);
export { router as spicyLevelRouter };
