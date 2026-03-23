// expenseHandler.js

// Function to calculate average expenses
function calculateAverage(expenses) {
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return total / expenses.length;
}

// Function to provide advice based on average expenses
function provideAdvice(average) {
    if (average < 100) {
        return "Great job! Your expenses are low. Keep it up!";
    } else if (average < 500) {
        return "You're doing okay, but consider cutting back on some expenses.";
    } else {
        return "Warning! Your expenses are quite high. It's time to review your spending habits.";
    }
}

// Exporting the functions
module.exports = { calculateAverage, provideAdvice };
