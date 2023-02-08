import express from "express";
import customerController from "../controllers/customer-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/customer", auth, customerController.createCustomer);
router.get("/api/customers", auth, customerController.getCustomers);
router.patch("/api/customer/:id", auth, customerController.updateCustomer);
export { router as customerRouter };
