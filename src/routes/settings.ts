import express from "express";
import auth from "../middleware/auth";
import settingsController from "../controllers/settings-controller";
const router = express.Router();

router.post("/api/settings", auth, settingsController.createSettings);

export { router as settingsRouter };
