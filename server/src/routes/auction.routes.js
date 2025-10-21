import { Router } from "express";
import { 
    endAuctionManuallyController, 
    getBidsForPromptController, 
    getAuctionStatusController,
    getAuctionHistoryController,
    clearAuctionDataController,
    createTestPendingPurchaseController
} from "../controllers/auction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Health check route
router.get("/health", (req, res) => {
    res.status(200).json({ message: "Auction router is working", timestamp: new Date().toISOString() });
});

// Simple test route
router.get("/test", (req, res) => {
    res.status(200).json({ 
        message: "Auction test endpoint working", 
        timestamp: new Date().toISOString(),
        routes: [
            "/health",
            "/test", 
            "/bids/:promptId",
            "/status/:promptId",
            "/history/:promptId",
            "/end/:promptId",
            "/clear/:promptId"
        ]
    });
});

// Public routes (no auth required)
router.route("/bids/:promptId").get(getBidsForPromptController);
router.route("/status/:promptId").get(getAuctionStatusController);
router.route("/history/:promptId").get(getAuctionHistoryController);

// Protected routes
router.use(authMiddleware);
router.route("/end/:promptId").post(endAuctionManuallyController);
router.route("/clear/:promptId").delete(clearAuctionDataController);
router.route("/test-pending/:promptId").post(createTestPendingPurchaseController);

export default router; 