import { Router } from "express";
import { addReviewController, deleteReviewController, getReviewsForPromptController } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route to get reviews
router.route("/prompt/:promptId").get(getReviewsForPromptController);

router.use(authMiddleware);

router.route("/add/:craftorId/:promptId").post(addReviewController);
router.route("/delete/:reviewId").delete(deleteReviewController);

export default router; 