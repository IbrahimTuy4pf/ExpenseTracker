
import cors from "cors";


import express from "express";

import dotenv from "dotenv";

import session from "express-session";

import cookieParser from "cookie-parser";

import passport from "./libs/passport.js";


import routes from "./routes/index.js";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors({
  
  origin: true,
  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "your-secret-key-change-this",
  

  resave: false,

  saveUninitialized: false,

  cookie: {

    secure: process.env.NODE_ENV === "production",
    

    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,

    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api-v1", routes);
app.use("*", (req, res) => {
  res.status(404).json({
    status: "404 Not found",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});


