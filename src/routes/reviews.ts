import express from "express";
import auth from "../middleware/auth";
import reviewsController from "../controllers/reviews-controller";
const router = express.Router();

router.post("/api/review", auth, reviewsController.addReview);
router.get("/api/reviews", auth, reviewsController.getReviews);

export { router as reviewRouter };
