import express from "express";
import orderlogsController from "../controllers/orderlogs-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/orderlog", auth, orderlogsController.createOrderLog);

export { router as orderLogsRouter };
