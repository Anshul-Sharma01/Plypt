
import { Router } from "express";
import { activateCraftorController, getCraftorProfile, updatePaymentDetails } from "../controllers/craftor.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.route("/activate").post(activateCraftorController);
router.route("/get-profile/:slug").get(getCraftorProfile);
router.route("/update-payment/:slug").patch(updatePaymentDetails);

export default router;