import { Router } from "express";
import { purchasePromptController, getUserPurchasedPromptsController, completePurchaseController } from "../controllers/purchase.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/buy/:promptId").post(purchasePromptController);
router.route("/my-purchases").get(getUserPurchasedPromptsController);
router.route("/complete").post(completePurchaseController);

export default router; 