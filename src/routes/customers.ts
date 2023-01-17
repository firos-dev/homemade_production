import express from "express";
import customerController from "src/controllers/customer-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/customer", auth, customerController.createCustomer);
router.get("/api/customers", auth, customerController.getCustomers);
export { router as customerRouter };
