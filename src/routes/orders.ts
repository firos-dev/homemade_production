import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import ordersController from "../controllers/orders-controller";

router.post("/api/order", auth, ordersController.createOrder);
router.get("/api/order", auth, ordersController.getOrders);
router.patch("/api/order/:id", auth, ordersController.updateOrder);
export { router as orderRouter };
