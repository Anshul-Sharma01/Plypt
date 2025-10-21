import { Router } from "express";
import { createPromptController, getPromptBySlugController, getAllPromptsController, changeVisibilityController, updatePromptDetailsController, deletePromptImagesController, addPromptImageController, getMyPromptsController, deletePromptImageController, deletePromptController } from "../controllers/prompt.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllPromptsController);
router.use(authMiddleware);

router.route("/my-prompts/:craftorId").get(getMyPromptsController);

router.route("/").post(upload.array("images"), createPromptController);
router.route("/view/:slug").get(getPromptBySlugController);
router.route("/update/:promptId").patch(updatePromptDetailsController);
router.route("/visibility/:promptId").patch(changeVisibilityController);
router.route("/add-image/:promptId").post(upload.single("image"), addPromptImageController);
router.route("/delete-images/:promptId").delete(deletePromptImagesController);
router.route("/delete-image/:promptId").delete(deletePromptImageController);
router.route("/delete/:promptId").delete(deletePromptController);

export default router; 