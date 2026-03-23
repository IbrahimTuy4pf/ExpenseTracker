import express from "express";
import {
  addTransaction,
  getDashboardInformation,
  getTransactions,
  transferMoneyToAccount,
} from "../controllers/transactionController.js";
import { getExpenseAdvice } from "../controllers/expenseAdvisorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.get("/dashboard", authMiddleware, getDashboardInformation);
router.get("/expense-advice", authMiddleware, getExpenseAdvice);
router.post("/add-transaction/:account_id", authMiddleware, addTransaction);
router.put("/transfer-money", authMiddleware, transferMoneyToAccount);

export default router;


