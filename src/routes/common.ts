import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import commonController from "../controllers/common-controller";

router.get("/api/home_api", auth, commonController.getCounts);
router.get("/api/recent_data", auth, commonController.getRecentData);

export { router as commonRouter };
