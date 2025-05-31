import { Router } from "express";
import { toggleBookmarkController, getUserBookmarksController } from "../controllers/bookmark.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/toggle/:promptId").post(toggleBookmarkController);
router.route("/my-bookmarks").get(getUserBookmarksController);

export default router; 