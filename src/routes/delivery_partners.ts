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
    } else if (file.fieldname === "licence_front") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    } else if (file.fieldname === "licence_back") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    } else if (file.fieldname === "car_front_image") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    } else if (file.fieldname === "car_back_image") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    } else if (file.fieldname === "id_card_front") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    } else if (file.fieldname === "id_card_back") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + "." + ext);
    }
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // set limit to 10 MB
  },
}).fields([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "licence_front",
    maxCount: 1,
  },
  {
    name: "licence_back",
    maxCount: 1,
  },
  {
    name: "car_front_image",
    maxCount: 1,
  },
  {
    name: "car_back_image",
    maxCount: 1,
  },
  {
    name: "id_card_front",
    maxCount: 1,
  },
  {
    name: "id_card_back",
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
  upload,
  deliveryPartnerController.updateDeliveryPartner
);
router.patch(
  "/api/delivery_partner/user/:id",
  auth,
  upload,
  deliveryPartnerController.updateDeliveryPartnerUser
);
export { router as deliveryPartnersRouter };
