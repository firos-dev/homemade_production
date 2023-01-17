import express from "express";
import rolesController from "../controllers/roles-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post('/api/role',auth, rolesController.createRole)

export {router as roleRouter}