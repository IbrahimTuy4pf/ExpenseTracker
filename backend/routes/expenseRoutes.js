const express = require('express');
const router = express.Router();
const { calculateAverage, provideAdvice } = require('../libs/expenseHandler');

// Sample route to handle expenses
router.post('/expenses', (req, res) => {
    const expenses = req.body.expenses; // Expecting an array of expense objects
    const average = calculateAverage(expenses);
    const advice = provideAdvice(average);
    res.json({ average, advice });
});

module.exports = router;
