import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import ordersController from "../controllers/orders-controller";
import { connectedUser, io } from "./../index";
console.log(connectedUser);

router.post("/api/order", auth, ordersController.createOrder);
router.patch("/api/order/:id", auth, ordersController.updateOrder);
router.patch(
  "/api/delivery/order/accept/:id",
  auth,
  ordersController.deliveryPartnerAllocation
);
router.get("/api/order", auth, ordersController.getOrders);
router.get("/api/current/order", auth, ordersController.getCurrentOrder);
router.get("/api/deliveries/count", auth, ordersController.getDeliveriesCount);
router.get(
  "/api/order/review/pending/:user_id",
  auth,
  ordersController.getLastReviewPending
);
router.get("/api/order/all", auth, ordersController.getAllOrders);
export { router as orderRouter };
