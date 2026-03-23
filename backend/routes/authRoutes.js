import express from "express";
import passport from "../libs/passport.js";
import { signinUser, signupUser, logoutUser, googleCallback } from "../controllers/authController.js";

const router = express.Router();

router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);
router.post("/logout", logoutUser);

// Google OAuth routes - only enable if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  router.get("/google/callback", passport.authenticate("google", { session: false }), googleCallback);
} else {
  // If Google OAuth is not configured, return helpful error
  router.get("/google", (req, res) => {
    res.status(400).json({
      status: "failed",
      message: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file, or use email/password to sign in."
    });
  });
  router.get("/google/callback", (req, res) => {
    res.status(400).json({
      status: "failed",
      message: "Google OAuth is not configured."
    });
  });
}

export default router;
