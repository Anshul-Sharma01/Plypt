import { Router } from "express";
import { addReviewController, deleteReviewController } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/add/:craftorId/:promptId").post(addReviewController);
router.route("/delete/:reviewId").delete(deleteReviewController);

export default router; 