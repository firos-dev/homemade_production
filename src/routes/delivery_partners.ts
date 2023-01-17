import express from "express";
import delivery_partnerController from "src/controllers/delivery_partner-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/delivery_partner", auth, delivery_partnerController.createDeliveryPartner);
router.get("/api/delivery_partners", auth, delivery_partnerController.getDeliveryPartners);
export { router as deliveryPartnersRouter };
