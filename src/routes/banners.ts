import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import multer from "multer";
import bannersController from "../controllers/banners-controller";

require("dotenv").config();
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
    }
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // set limit to 10 MB
  },
}).single("image"); // Change `.fields` to `.single` and pass the field name "image" only

router.post("/api/banners", auth, upload, bannersController.addBanners);
router.get("/api/banners", bannersController.getBanners);
router.delete("/api/banner/:id", auth, bannersController.deleteBanner);

export { router as bannersRouter };
