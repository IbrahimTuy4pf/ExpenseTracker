import React, { useEffect, useState } from "react";
import { transactionAPI } from "../services/api";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiTrendingUp, FiDollarSign } from "react-icons/fi";

const ExpenseAdvisor = () => {
  const [adviceData, setAdviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionAPI.getExpenseAdvice();
      if (data.status === "success") {
        setAdviceData(data.data);
      } else {
        setError(data.message || "Failed to fetch expense advice");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch expense advice");
      console.error("Error fetching expense advice:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getWarningIcon = (type) => {
    switch (type) {
      case "critical":
        return <FiAlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <FiInfo className="w-6 h-6 text-yellow-500" />;
      default:
        return <FiInfo className="w-6 h-6 text-blue-500" />;
    }
  };

  const getAdviceIcon = (type) => {
    switch (type) {
      case "positive":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "urgent":
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      case "savings":
        return <FiDollarSign className="w-5 h-5 text-blue-500" />;
      default:
        return <FiInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Analyzing your spending...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!adviceData) {
    return null;
  }

  const { currentMonth, comparison, topCategories, warnings, advice } = adviceData;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Spending Ratio</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentMonth.spendingRatio.toFixed(1)}%
              </p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            {currentMonth.spendingRatio > 90
              ? "Critical"
              : currentMonth.spendingRatio > 75
              ? "High"
              : currentMonth.spendingRatio > 50
              ? "Moderate"
              : "Good"}
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Savings Rate</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {currentMonth.savingsPercentage.toFixed(1)}%
              </p>
            </div>
            <FiDollarSign className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            {formatCurrency(currentMonth.savings)}
          </p>
        </div>

        <div className="glass rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Daily Average</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(currentMonth.dailyAverage)}
              </p>
            </div>
            <FiInfo className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            This month
          </p>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FiAlertCircle className="w-6 h-6" />
            Alerts
          </h3>
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  warning.type === "critical"
                    ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {getWarningIcon(warning.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {warning.title}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {warning.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advice */}
      {advice.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FiInfo className="w-6 h-6" />
            Financial Advice
          </h3>
          <div className="space-y-4">
            {advice.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start gap-3 mb-3">
                  {getAdviceIcon(item.type)}
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                    {item.title}
                  </h4>
                </div>
                <ul className="space-y-2 ml-8">
                  {item.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Top Spending Categories
          </h3>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {category.source}
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {category.percentage.toFixed(1)}% of total expenses
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseAdvisor;


