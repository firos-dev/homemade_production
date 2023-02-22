import express from "express";
import itemsController from "../controllers/items-controller";
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

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, uniqueSuffix + "." + ext);
  },
});

var upload = multer({ storage: storage }).single("image");

router.post("/api/item", auth, upload, itemsController.createItem);
router.get("/api/items", auth, itemsController.getItems);
router.patch("/api/item/:id", auth, upload, itemsController.updateItem);
export { router as itemsRouter };
