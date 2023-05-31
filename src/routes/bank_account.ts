import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import paymentsController from "../controllers/payments-controller";
import bank_accountController from "src/controllers/bank_account-controller";

router.post(
  "/api/add/bank_account",
  auth,
  bank_accountController.addBankAccount
);
router.get("/api/bank_account", auth, bank_accountController.getAccounts);
router.patch("/api/bank_account/:id", auth, bank_accountController.updateAccount);
router.get("/api/payment_method", auth, paymentsController.getPaymentMethod);
router.get("/api/earnings", auth, paymentsController.getEarnings);
export { router as paymentRouter };
