import express from "express";
import itemsController from "../controllers/items-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/item", auth, itemsController.createItem);
router.get("/api/items", auth, itemsController.getItems);
router.patch("/api/item/:id", auth, itemsController.updateItem);
export { router as itemsRouter };
