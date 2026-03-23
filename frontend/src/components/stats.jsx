import React, { useEffect } from "react";
import { BsCashCoin, BsCurrencyDollar } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { SiCashapp } from "react-icons/si";
import useStore from "../store";
import { transactionAPI } from "../services/api";

const ICON_STYLES = [ 
  "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
  "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  "bg-gradient-to-br from-rose-500 to-pink-500 text-white",
];

const Stats = () => {
  const { dashboardData, setDashboardData } = useStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await transactionAPI.getDashboard();
        if (data.status === "success") {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, [setDashboardData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const data = [
    {
      label: "Your Total Balance",
      amount: dashboardData?.availableBalance || 0,
      increase: 10.9,
      icon: <BsCurrencyDollar size={26} />,
    },
    {
      label: "Total Income",
      amount: dashboardData?.totalIncome || 0,
      icon: <BsCashCoin size={26} />,
      increase: 8.9,
    },
    {
      label: "Total Expense",
      amount: dashboardData?.totalExpense || 0,
      icon: <SiCashapp size={26} />,
      increase: -10.9,
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
      {data.map((item, index) => (
        <div
          key={index + item.label}
          className='glass card-hover rounded-2xl p-6 border border-white/20 shadow-lg animate-fade-in'
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className='flex items-start justify-between mb-5'>
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl ${ICON_STYLES[index]} transform hover:scale-110 transition-transform`}
            >
              {item.icon}
            </div>
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md ${
              item.increase > 0 
                ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white" 
                : "bg-gradient-to-r from-rose-400 to-rose-600 text-white"
            }`}>
              {item.increase > 0 ? <IoMdArrowUp size={16} /> : <IoMdArrowDown size={16} />}
              {Math.abs(item.increase)}%
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide'>
              {item.label}
            </p>
            <p className='text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent'>
              {formatCurrency(item.amount)}
            </p>
            <div className='flex items-center gap-2 pt-2'>
              <div className={`h-1.5 w-1.5 rounded-full ${
                item.increase > 0 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></div>
              <p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                vs last month
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;

