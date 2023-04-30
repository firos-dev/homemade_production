import express from "express";
import chefsController from "../controllers/chefs-controller";
import auth from "../middleware/auth";
const router = express.Router();
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
    } else if (file.fieldname === "certificate_file") {
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
    name: "certificate_file",
    maxCount: 1,
  },
]);

router.post("/api/chef", auth, upload, chefsController.createChef);
router.get("/api/chefs", auth, chefsController.getChefs);
router.patch("/api/chef/:id", auth, upload, chefsController.updateChef);
router.get(
  "/api/chef/day/distance",
  auth,
  upload,
  chefsController.getChefBydateDistance
);
export { router as chefsRouter };
