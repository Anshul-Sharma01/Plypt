import { Router } from "express";
import { endAuctionManuallyController } from "../controllers/auction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.route("/end/:promptId").post(endAuctionManuallyController);

export default router; 