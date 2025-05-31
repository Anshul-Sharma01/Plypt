import { Router } from "express";
import { createPromptController, getPromptBySlugController, getAllPromptsController, changeVisibilityController, updatePromptDetailsController, deletePromptImagesController, addPromptImageController } from "../controllers/prompt.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/").post(upload.array("images"), createPromptController).get(getAllPromptsController);
router.route("/slug/:slug").get(getPromptBySlugController);
router.route("/update/:promptId").patch(updatePromptDetailsController);
router.route("/visibility/:promptId").patch(changeVisibilityController);
router.route("/add-image/:promptId").post(upload.single("image"), addPromptImageController);
router.route("/delete-images/:promptId").delete(deletePromptImagesController);

export default router; 