import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import session from 'express-session';
import passport from './config/googlePassport.js';
import { errorHandler } from "./utils/errorHandler.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onPromptCreation } from "./inngest/functions/onPromptCreation.js";


config({ path: "./.env" });
const app = express();

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

// Custom morgan logger that skips Inngest sync requests
app.use(morgan("dev", {
    skip: (req, res) => {
        // Skip logging PUT requests to /api/v1/inngest (sync requests)
        return req.method === 'PUT' && req.path === '/api/v1/inngest';
    }
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());


import { auctionRouter, bookmarkRouter, commentRouter, craftorRouter, googleAuthRouter, likeRouter, promptRouter, purchaseRouter, reviewRouter, userRouter, } from "./router.js";



app.use("/api/v1/user", userRouter);
app.use("/api/v1/craftor", craftorRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/prompt", promptRouter);
app.use("/api/v1/auction", auctionRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/bookmark", bookmarkRouter);
app.use('/api/v1/auth', googleAuthRouter);

app.use("/api/v1/inngest", serve({
    client : inngest,
    functions : [onPromptCreation]
}))

app.use(errorHandler);

export default app;


