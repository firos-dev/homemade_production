import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import paymentController from "../controllers/payment-controller"

// router.post("/api/payment_method", auth, paymentsController.addPaymentMethod);
// router.post("/api/add/bank_account", auth, paymentsController.addBankAccount);
// router.get("/api/bank_account", auth, paymentsController.getBankAccount);
router.post("/api/payment", auth, paymentController.createPayment);
router.get("/api/payment", auth, paymentController.getPayments);
router.get("/api/payment_methods", auth, paymentController.getPaymentMethods);
// router.get("/api/earnings", auth, paymentsController.getEarnings);
// export { router as paymentRouter };

export {router as paymentRouter}
