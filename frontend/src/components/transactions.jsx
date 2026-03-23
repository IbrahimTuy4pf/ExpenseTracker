import React, { useEffect } from "react";
import Title from "./title";
import { RiProgress3Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import useStore from "../store";
import { transactionAPI } from "../services/api";

const Transactions = () => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const transactions = dashboardData?.lastTransactions || [];

  return (
    <div className='glass card-hover rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl animate-fade-in'>
      <Title title='Latest Transactions' />

      <div className='overflow-x-auto mt-6'>
        <table className='w-full'>
          <thead>
            <tr className='border-b-2 border-slate-200 dark:border-slate-700'>
              <th className='py-3 px-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400'>Date</th>
              <th className='py-3 px-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400'>Description</th>
              <th className='py-3 px-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400'>Status</th>
              <th className='py-3 px-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400'>Source</th>
              <th className='py-3 px-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400'>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <tr
                  key={item.id}
                  className='border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                >
                  <td className='py-4 px-3 text-sm text-slate-600 dark:text-slate-400'>{formatDate(item.createdat)}</td>
                  <td className='py-4 px-3'>
                    <p className='font-semibold text-slate-900 dark:text-slate-100'>
                      {item.description}
                    </p>
                  </td>
                  <td className='py-4 px-3'>
                    <div className='flex items-center gap-2'>
                      {item.status === "Pending" && (
                        <RiProgress3Line className='text-amber-500' size={20} />
                      )}
                      {item.status === "Completed" && (
                        <IoCheckmarkDoneCircle className='text-emerald-500' size={20} />
                      )}
                      {item.status === "Rejected" && (
                        <TiWarning className='text-rose-500' size={20} />
                      )}
                      <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>{item.status}</span>
                    </div>
                  </td>
                  <td className='py-4 px-3 text-sm text-slate-600 dark:text-slate-400'>{item.source}</td>
                  <td className={`py-4 px-3 text-base font-bold ${
                    item.type === "income" 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-rose-600 dark:text-rose-400"
                  }`}>
                    {item.type === "income" ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className='py-12 text-center text-slate-500 dark:text-slate-400'>
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;

