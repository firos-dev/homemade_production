import express from "express";
import auth from "../middleware/auth";
const router = express.Router();
import cuisineController from "../controllers/cuisines-controller";
import multer from "multer";

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
    } else if (file.fieldname === "icon") {
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
    name: "icon",
    maxCount: 1,
  },
]);

router.post("/api/cuisine", auth, upload, cuisineController.createCuisine);
router.get("/api/cuisines", auth, cuisineController.getCuisines);
router.get("/api/cuisine/items", auth, cuisineController.getCuisineItems);
router.patch("/api/cuisine/:id", auth, upload, cuisineController.updateCuisine);
export { router as cuisineRouter };
