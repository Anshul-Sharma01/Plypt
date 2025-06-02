import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";

config({ path: "./.env" });
const app = express();

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(morgan("dev"));


// Router Imports
import userRouter from "./routes/user.routes.js";
import craftorRouter from "./routes/craftor.routes.js";
import commentRouter from "./routes/comment.routes.js";
import promptRouter from "./routes/prompt.routes.js";
import auctionRouter from "./routes/auction.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";
import reviewRouter from "./routes/review.routes.js";
import likeRouter from "./routes/like.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import { errorHandler } from "./utils/errorHandler.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/craftor", craftorRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/prompt", promptRouter);
app.use("/api/v1/auction", auctionRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/bookmark", bookmarkRouter);

app.use(errorHandler);

export default app;


