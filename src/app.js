// @ts-nocheck
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import compression from "compression";

const app = express();

dotenv.config();

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// **********************************************************

// const xss = require("xss-clean");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");
// const hpp = require("hpp");
// const compression = require("compression");

// **********************************************************
// IMPORT ROUTERS

import authRouter from "./routes/v1/auth.route.js";
import userRouter from "./routes/v1/user.route.js";
import bannerRouter from "./routes/v1/banner.route.js";
import settingsRouter from "./routes/v1/settings.route.js";
import categoryRouter from "./routes/v1/category.route.js";
import serviceRouter from "./routes/v1/service.route.js";
import portfolioRouter from "./routes/v1/portfoilo.route.js";
import uploadRouter from "./routes/v1/upload.route.js";
import aboutUsRouter from "./routes/v1/aboutUs.route.js";
import detailRouter from "./routes/v1/detail.route.js";

// ***********************************************************
// START CORS

var allowedOrigins = [
  "https://inceptivestudio.com/",
  "http://inceptivestudio.com/",
  "http://127.0.0.1:8080",
];

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },

  // Request methods you wish to allow
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  credentials: true,
  // For legacy browser support
  optionsSuccessStatus: 200,
  // Request headers you wish to allow
  allowedHeaders: [
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token,multipart/form-data,Access-Control-Allow-Origin",
  ],
  exposedHeaders: ["x-auth-token"],
};

app.use(cors());

// **********************************************************
// Set security HTTP headers

app.use(helmet());

// **********************************************************
// Data sanitization against XSS

app.use(xss());

// **********************************************************
// Prevent parameter pollution

app.use(
  hpp({
    whitelist: [],
  })
);

// **********************************************************

app.use(compression());

// **********************************************************
// Development logging

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("common"));
}

// **********************************************************
// Data sanitization against NoSQL query injection

app.use(mongoSanitize());

// **********************************************************

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());

// ***********************************************************
// ROUTES

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/banner", bannerRouter);
app.use("/v1/settings", settingsRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/service", serviceRouter);
app.use("/v1/portfolio", portfolioRouter);
app.use("/v1/file-upload", uploadRouter);
app.use("/v1/about-us", aboutUsRouter);
app.use("/v1/details", detailRouter);

// To check if server is running
app.get("/*", function (req, res) {
  return res.send("Hi , This inceptive Studio api");
});

// Handle route not found
app.all("*", (req, res, next) => {
  console.log("reach");
  return res
    .status(404)
    .send(`Can't find "${req.originalUrl}" on this server!`);
});

// ***********************************************************

export default app;
