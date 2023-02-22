import express from "express";
import followersController from "../controllers/followers-controller";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/api/follow_user", auth, followersController.followUser);
router.get("/api/followers", auth, followersController.getFollowers);
router.delete("/api/unfollow/:id", auth, followersController.unfollowUser);

export { router as followersRouter };