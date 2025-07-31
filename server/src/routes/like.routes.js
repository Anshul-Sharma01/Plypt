import { Router } from "express";
import { toggleLikeController, getPromptLikesController, getTopLikedPromptsController, getLikedPrompts } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/toggle/:promptId").post(toggleLikeController);
router.route("/count/:promptId").get(getPromptLikesController);
router.route("/top-liked").get(getTopLikedPromptsController);
router.route("/my-liked").get(getLikedPrompts);

export default router; 