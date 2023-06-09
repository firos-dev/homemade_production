import express from "express";
import itemsController from "../controllers/items-controller";
import auth from "../middleware/auth";
const router = express.Router();
import multer from "multer";

require("dotenv").config();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const path = "./upload";
    fs.mkdirSync(path, { recursive: true });
    callback(null, path);
  },
  filename: function (req, file, cb) {
    const ext = /[.]/.exec(file.originalname)
      ? /[^.]+$/.exec(file.originalname)
      : undefined;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + ext);
  },
});

const multi_upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 70, // set limit to 70 MB
  },
}).array("images", 7);

const upload = (req: any, res: any, next: any) => {
  multi_upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res
        .status(500)
        .send({ error: { message: `Multer uploading error: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      // An unknown error occurred when uploading.
      if (err.name == "ExtensionError") {
        res
          .status(413)
          .send({ error: { message: err.message } })
          .end();
      } else {
        res
          .status(500)
          .send({
            error: { message: `unknown uploading error: ${err.message}` },
          })
          .end();
      }
      return;
    }

    // Everything went fine.
    // show file `req.files`
    // show body `req.body`
    next();
  });
};

router.post("/api/item", auth, upload, itemsController.createItem);
router.get("/api/items", itemsController.getItems);
router.patch("/api/item/:id", auth, upload, itemsController.updateItem);
router.get("/api/item/nearest/available", itemsController.getNearestItemsbyAvailability);
export { router as itemsRouter };
