import { pool } from "../libs/database.js";

export const getExpenseAdvice = async (req, res) => {
  try {
    const { userId } = req.body.user;

    // Get current month transactions
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

    // Get current month expenses
    const currentMonthExpenses = await pool.query({
      text: `SELECT SUM(amount) as total FROM tbltransaction 
             WHERE user_id = $1 AND type = 'expense' 
             AND createdat BETWEEN $2 AND $3`,
      values: [userId, firstDayOfMonth, lastDayOfMonth],
    });

    // Get current month income
    const currentMonthIncome = await pool.query({
      text: `SELECT SUM(amount) as total FROM tbltransaction 
             WHERE user_id = $1 AND type = 'income' 
             AND createdat BETWEEN $2 AND $3`,
      values: [userId, firstDayOfMonth, lastDayOfMonth],
    });
  
    // Get last 3 months average expenses
    const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    const lastThreeMonthsExpenses = await pool.query({
      text: `SELECT SUM(amount) as total FROM tbltransaction 
             WHERE user_id = $1 AND type = 'expense' 
             AND createdat >= $2`,
      values: [userId, threeMonthsAgo],
    });

    // Get expenses by category (source)
    const expensesBySource = await pool.query({
      text: `SELECT source, SUM(amount) as total FROM tbltransaction 
             WHERE user_id = $1 AND type = 'expense' 
             AND createdat BETWEEN $2 AND $3 
             GROUP BY source ORDER BY total DESC LIMIT 5`,
      values: [userId, firstDayOfMonth, lastDayOfMonth],
    });
  
    // Get daily spending average for current month
    const daysInMonth = currentDate.getDate();
    const currentMonthTotal = parseFloat(currentMonthExpenses.rows[0]?.total || 0);
    const currentMonthIncomeTotal = parseFloat(currentMonthIncome.rows[0]?.total || 0);
    const dailyAverage = daysInMonth > 0 ? currentMonthTotal / daysInMonth : 0;
    const threeMonthsAverage = parseFloat(lastThreeMonthsExpenses.rows[0]?.total || 0) / 3;

    // Calculate spending ratio
    const spendingRatio = currentMonthIncomeTotal > 0 
      ? (currentMonthTotal / currentMonthIncomeTotal) * 100 
      : 100;

    // Calculate savings
    const savings = currentMonthIncomeTotal - currentMonthTotal;
    const savingsPercentage = currentMonthIncomeTotal > 0 
      ? (savings / currentMonthIncomeTotal) * 100 
      : 0;

    // Generate advice based on spending patterns
    const advice = [];
    const warnings = [];

    // Overspending check
    if (spendingRatio > 90) {
      warnings.push({
        type: "critical",
        title: "Critical: Overspending Alert",
        message: `You're spending ${spendingRatio.toFixed(1)}% of your income this month. You need to reduce expenses immediately.`,
      });
      advice.push({
        type: "urgent",
        title: "Immediate Action Required",
        suggestions: [
          "Review all non-essential expenses and cancel unnecessary subscriptions",
          "Create a strict budget and stick to it",
          "Consider using the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
          "Track every expense for the next week to identify spending patterns",
        ],
      });
    } else if (spendingRatio > 75) {
      warnings.push({
        type: "warning",
        title: "Warning: High Spending",
        message: `You're spending ${spendingRatio.toFixed(1)}% of your income. Consider reducing expenses to build savings.`,
      });
      advice.push({
        type: "moderate",
        title: "Budget Optimization Tips",
        suggestions: [
          "Try to reduce spending to 70% of income to build a savings buffer",
          "Review your top spending categories and find areas to cut back",
          "Set up automatic savings transfers",
          "Use the 30-day rule for non-essential purchases",
        ],
      });
    }

    // Compare with previous months
    if (currentMonthTotal > threeMonthsAverage * 1.2) {
      warnings.push({
        type: "warning",
        title: "Spending Increase Detected",
        message: `Your spending this month is ${((currentMonthTotal / threeMonthsAverage - 1) * 100).toFixed(1)}% higher than your 3-month average.`,
      });
      advice.push({
        type: "awareness",
        title: "Spending Pattern Alert",
        suggestions: [
          "Review what caused the increase in spending this month",
          "Identify one-time expenses vs recurring expenses",
          "Set a monthly spending limit based on your 3-month average",
        ],
      });
    }

    // Top spending categories
    if (expensesBySource.rows.length > 0) {
      const topCategory = expensesBySource.rows[0];
      const topCategoryPercentage = currentMonthTotal > 0 
        ? (parseFloat(topCategory.total) / currentMonthTotal) * 100 
        : 0;

      if (topCategoryPercentage > 40) {
        advice.push({
          type: "optimization",
          title: "Top Spending Category Analysis",
          suggestions: [
            `${topCategory.source} accounts for ${topCategoryPercentage.toFixed(1)}% of your expenses. Consider ways to reduce spending in this category.`,
            "Compare prices and look for discounts or alternatives",
            "Set a specific budget limit for this category",
          ],
        });
      }
    }

    // Savings advice
    if (savingsPercentage < 10 && currentMonthIncomeTotal > 0) {
      advice.push({
        type: "savings",
        title: "Build Your Savings",
        suggestions: [
          "Aim to save at least 10-20% of your income",
          "Start with small amounts - even $50/month adds up",
          "Consider opening a high-yield savings account",
          "Set up automatic transfers to savings on payday",
        ],
      });
    } else if (savingsPercentage >= 20) {
      advice.push({
        type: "positive",
        title: "Great Job!",
        suggestions: [
          `You're saving ${savingsPercentage.toFixed(1)}% of your income - excellent work!`,
          "Consider investing a portion of your savings for long-term growth",
          "Build an emergency fund (3-6 months of expenses)",
          "Set financial goals for your savings",
        ],
      });
    }

    // Daily spending advice
    if (dailyAverage > (threeMonthsAverage / 30) * 1.15) {
      advice.push({
        type: "daily",
        title: "Daily Spending Management",
        suggestions: [
          `Your daily average spending is $${dailyAverage.toFixed(2)}. Try to reduce it to $${(threeMonthsAverage / 30).toFixed(2)}.`,
          "Use cash or a prepaid card for daily expenses to stay within budget",
          "Track expenses daily to avoid overspending",
          "Plan meals and shopping trips to reduce impulse purchases",
        ],
      });
    }

    // If no specific issues, provide general advice
    if (advice.length === 0 && warnings.length === 0) {
      advice.push({
        type: "general",
        title: "Keep Up the Good Work!",
        suggestions: [
          "Your spending patterns look healthy",
          "Continue tracking expenses to maintain good financial habits",
          "Consider setting financial goals for the future",
          "Review your budget quarterly to ensure it still meets your needs",
        ],
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        currentMonth: {
          income: currentMonthIncomeTotal,
          expenses: currentMonthTotal,
          savings: savings,
          savingsPercentage: savingsPercentage,
          spendingRatio: spendingRatio,
          dailyAverage: dailyAverage,
        },
        comparison: {
          threeMonthsAverage: threeMonthsAverage,
          difference: currentMonthTotal - threeMonthsAverage,
          differencePercentage: threeMonthsAverage > 0 
            ? ((currentMonthTotal - threeMonthsAverage) / threeMonthsAverage) * 100 
            : 0,
        },
        topCategories: expensesBySource.rows.map(row => ({
          source: row.source,
          amount: parseFloat(row.total),
          percentage: currentMonthTotal > 0 
            ? (parseFloat(row.total) / currentMonthTotal) * 100 
            : 0,
        })),
        warnings: warnings,
        advice: advice,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};


