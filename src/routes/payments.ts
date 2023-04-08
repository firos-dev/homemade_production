import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import paymentsController from "../controllers/payments-controller";

router.post("/api/payment_method", auth, paymentsController.addPaymentMethod);
router.post("/api/add/bank_account", auth, paymentsController.addBankAccount);
router.get("/api/bank_account", auth, paymentsController.getBankAccount);
router.get("/api/payment_method", auth, paymentsController.getPaymentMethod);
router.get("/api/earnings", auth, paymentsController.getEarnings);
export { router as paymentRouter };
