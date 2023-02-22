import express from "express";
import availabilitiesController from "../controllers/availabilities-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post(
  "/api/availabilities",
  auth,
  availabilitiesController.createAvailabilites
);
router.get(
  "/api/availabilities",
  auth,
  availabilitiesController.getAvailabilities
);
router.patch(
  "/api/availability/:id",
  auth,
  availabilitiesController.updateAvailability
);
export { router as availabilitiesRouter };
