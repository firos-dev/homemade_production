import express from "express";
import locationsController from "../controllers/locations-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/drop_off_point", auth, locationsController.createDropOffPoint);
router.get("/api/drop_off_point", auth, locationsController.getDropOffPoints);
export { router as locationsRouter };
