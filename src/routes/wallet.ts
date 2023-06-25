import express from "express";
import auth from "../middleware/auth";
import walletController from "../controllers/wallet-controller";
const router = express.Router();

router.get("/api/wallet", auth, walletController.getWalletOfUser);
router.patch("/api/wallet", auth, walletController.updateWallet);

export {router as walletRouter}
