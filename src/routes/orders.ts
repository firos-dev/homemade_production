import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import ordersController from "../controllers/orders-controller";
import { connectedUser, io } from "./../index";
import { sendNotification } from "./../helpers/notification";
console.log(connectedUser);

router.post("/api/order", auth, ordersController.createOrder);
router.get("/api/order", auth, ordersController.getOrders);
router.patch("/api/order/:id", auth, ordersController.updateOrder);
router.get("/api/current/order", auth, ordersController.getCurrentOrder);
router.get("/api/current/order", (req, res) => {});
router.get("/api/deliveries/count", auth, ordersController.getDeliveriesCount);
export { router as orderRouter };
