import { Router } from "express";
import { addCommentController, deleteCommentController } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/add").post(addCommentController);
router.route("/delete").delete(deleteCommentController);

export default router;


