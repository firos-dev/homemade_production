import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import cartController from "../controllers/cart-controller";

router.post("/api/cart", auth, cartController.addToCart);
router.get("/api/cart", auth, cartController.getCart);
router.patch("/api/cart/:id", auth, cartController.updateCart);
router.delete("/api/cart/:id", auth, cartController.deleteCart);
export { router as cartRouter };
