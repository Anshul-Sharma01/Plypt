import { Router } from "express";
import { addCommentController, deleteCommentController, fetchAllCommentsController } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/add").post(addCommentController);
router.route("/delete").delete(deleteCommentController);
router.route("/fetch/:promptId").get(fetchAllCommentsController);

export default router;


