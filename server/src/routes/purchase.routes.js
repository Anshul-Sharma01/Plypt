import { Router } from "express";
import { 
    purchasePromptController, 
    getUserPurchasedPromptsController, 
    completePurchaseController,
    getPendingPurchaseController,
    cancelPendingPurchaseController
} from "../controllers/purchase.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/buy/:promptId").post(purchasePromptController);
router.route("/my-purchases").get(getUserPurchasedPromptsController);
router.route("/complete").post(completePurchaseController);
router.route("/pending/:promptId").get(getPendingPurchaseController);
router.route("/cancel/:promptId").delete(cancelPendingPurchaseController);

export default router; 