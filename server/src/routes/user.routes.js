import { Router } from "express";
import { fetchUserProfile, loginUserController, logoutUserController, refreshAccessTokenController, registerUserController, updateAvatarController, updateProfileController } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/login").post(loginUserController);
router.route("/register").post( upload.single("avatar"), registerUserController);

router.use(authMiddleware);

router.route("/me").get(fetchUserProfile);
router.route("/refresh-access-token").post(refreshAccessTokenController);
router.route("/update-profile").patch( upload.none(), updateProfileController);
router.route("/update-avatar").patch(upload.single("avatar"), updateAvatarController);
router.route("/logout").get(logoutUserController);


export default router;
