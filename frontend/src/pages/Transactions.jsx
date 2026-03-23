import React, { useEffect, useState, useCallback } from "react";
import Info from "../components/info";
import Title from "../components/title";
import { RiProgress3Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import { transactionAPI } from "../services/api";
import useStore from "../store";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = searchTerm ? { s: searchTerm } : {};
      const data = await transactionAPI.getTransactions(params);
      if (data.status === "success") {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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

  return (
    <div className='px-0 md:px-5 2xl:px-20'>
      <Info
        title='Transactions'
        subTitle='View and manage all your transactions'
      />

      <div className='mb-6'>
        <div className='glass border border-white/20 rounded-xl px-5 py-3 shadow-lg max-w-md focus-within:ring-2 focus-within:ring-blue-500 transition-all'>
          <input
            type='text'
            placeholder='Search transactions...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium'
          />
        </div>
      </div>

      <div className='glass rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl mt-6'>
        <div className='overflow-x-auto'>
          {loading ? (
            <div className='text-center py-16'>
              <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent'></div>
              <p className='mt-4 text-slate-600 dark:text-slate-400 font-medium'>Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <table className='w-full'>
              <thead>
                <tr className='border-b-2 border-slate-200 dark:border-slate-700'>
                  <th className='py-4 px-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>Date</th>
                  <th className='py-4 px-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>Description</th>
                  <th className='py-4 px-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>Type</th>
                  <th className='py-4 px-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>Status</th>
                  <th className='py-4 px-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>Source</th>
                  <th className='py-4 px-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr
                    key={item.id}
                    className='border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                  >
                    <td className='py-4 px-4 text-sm text-slate-600 dark:text-slate-400'>{formatDate(item.createdat)}</td>
                    <td className='py-4 px-4'>
                      <p className='font-semibold text-slate-900 dark:text-slate-100'>
                        {item.description}
                      </p>
                    </td>
                    <td className='py-4 px-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className='py-4 px-4'>
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
                    <td className='py-4 px-4 text-sm text-slate-600 dark:text-slate-400'>{item.source}</td>
                    <td
                      className={`py-4 px-4 text-base font-bold ${
                        item.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='text-center py-16'>
              <div className='text-6xl mb-4'>📊</div>
              <p className='text-slate-600 dark:text-slate-400 font-semibold text-lg'>No transactions found</p>
              <p className='text-slate-500 dark:text-slate-500 text-sm mt-2'>Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;

