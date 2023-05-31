import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import card_detailsController from "src/controllers/card_details-controller";

router.post("/api/add/card_details", auth, card_detailsController.addCard);
router.get("/api/card_details", auth, card_detailsController.getCards);
router.patch("/api/card_details/:id", auth, card_detailsController.updateCard);
export { router as paymentRouter };
