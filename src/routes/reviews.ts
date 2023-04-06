import express from "express";
import auth from "../middleware/auth";
import reviewsController from "../controllers/reviews-controller";
const router = express.Router();

router.post("/api/review", auth, reviewsController.addReview);
router.get("/api/reviews", auth, reviewsController.getReviews);
router.get("/api/average/rating", auth, reviewsController.getAvrageRating);

export { router as reviewRouter };
