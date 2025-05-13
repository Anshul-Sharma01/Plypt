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

app.use("/api/v1/user", userRouter);
app.use("/api/v1/craftor", craftorRouter);
app.use("/api/v1/comment", commentRouter);

export default app;


