import express from "express";
import deliveryPartnerController from "../controllers/delivery_partner-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post(
  "/api/delivery_partner",
  auth,
  deliveryPartnerController.createDeliveryPartner
);
router.get(
  "/api/delivery_partners",
  auth,
  deliveryPartnerController.getDeliveryPartners
);
router.patch(
  "/api/delivery_partner/:id",
  auth,
  deliveryPartnerController.updateDeliveryPartner
);
router.patch(
  "/api/delivery_partner/user/:id",
  auth,
  deliveryPartnerController.updateDeliveryPartnerUser
);
export { router as deliveryPartnersRouter };
