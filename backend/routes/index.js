import express from "express";
import authRoutes from "./authRoutes.js";
import accountRoutes from "./accountRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend server is running",
    timestamp: new Date().toISOString()
  });
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/account", accountRoutes);
router.use("/transaction", transactionRoutes);

export default router;


