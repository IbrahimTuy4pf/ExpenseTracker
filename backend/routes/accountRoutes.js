import express from "express";
import {
  addMoneyToAccount,
  addExpenseToAccount,
  createAccount,
  getAccounts,
} from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id?", authMiddleware, getAccounts);
router.post("/create", authMiddleware, createAccount);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);
router.put("/add-expense/:id", authMiddleware, addExpenseToAccount);

export default router;


