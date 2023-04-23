import express from "express";
import auth from "../middleware/auth";
import idmasterController from "../controllers/idmaster-controller";

const router = express.Router();

router.post("/api/id_master", auth, idmasterController.createIdmaster);

export { router as idMasterRouter };
