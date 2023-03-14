import express from "express";
import multer from "multer";
import deliveryPartnerController from "../controllers/delivery_partner-controller";
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
    if (file.fieldname === "image") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    } else if (file.fieldname === "licence_file") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    }
  },
});

var upload = multer({ storage: storage }).fields([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "licence_file",
    maxCount: 1,
  },
]);

router.post(
  "/api/delivery_partner",
  auth,
  upload,
  deliveryPartnerController.createDeliveryPartner
);
router.get(
  "/api/delivery_partners",
  auth,
  deliveryPartnerController.getDeliveryPartners
);
router.patch(
  "/api/delivery_partner/:id",
  auth,
  deliveryPartnerController.updateDeliveryPartner
);
router.patch(
  "/api/delivery_partner/user/:id",
  auth,
  upload,
  deliveryPartnerController.updateDeliveryPartnerUser
);
export { router as deliveryPartnersRouter };
