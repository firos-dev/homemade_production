import express from "express";
import multer from "multer";
import customerController from "../controllers/customer-controller";
import auth from "../middleware/auth";
const router = express.Router();

const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const path = "./upload";
    fs.mkdirSync(path, { recursive: true });
    callback(null, path);
  },
  filename: function (req, file, callback) {
    const ext = /[.]/.exec(file.originalname)
      ? /[^.]+$/.exec(file.originalname)
      : undefined;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, uniqueSuffix + "." + ext);
  },
});

var upload = multer({ storage: storage }).single("image");

router.post("/api/customer", auth, customerController.createCustomer);
router.get("/api/customers", auth, customerController.getCustomers);
router.patch(
  "/api/customer/:id",
  auth,
  upload,
  customerController.updateCustomer
);
export { router as customerRouter };
