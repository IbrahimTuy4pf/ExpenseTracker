import React, { useEffect } from "react";
import { FaBtc, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";
import Title from "./title";
import useStore from "../store";
import { transactionAPI } from "../services/api";

const getAccountIcon = (accountName) => {
  const name = accountName.toLowerCase();
  if (name.includes("crypto") || name.includes("bitcoin")) {
    return (
      <div className='w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full'>
        <FaBtc size={26} />
      </div>
    );
  } else if (name.includes("visa")) {
    return (
      <div className='w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full'>
        <RiVisaLine size={26} />
      </div>
    );
  } else if (name.includes("mastercard") || name.includes("master")) {
    return (
      <div className='w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full'>
        <FaCcMastercard size={26} />
      </div>
    );
  } else if (name.includes("paypal")) {
    return (
      <div className='w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full'>
        <FaPaypal size={26} />
      </div>
    );
  } else {
    return (
      <div className='w-12 h-12 bg-violet-600 text-white flex items-center justify-center rounded-full'>
        <span className='text-lg font-bold'>
          {accountName[0]?.toUpperCase() || "A"}
        </span>
      </div>
    );
  }
};

const Accounts = () => {
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

  const accounts = dashboardData?.lastAccount || [];

  return (
    <div className='glass card-hover rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl animate-fade-in' style={{ animationDelay: '0.2s' }}>
      <Title title='Accounts' />
      <p className='text-sm font-medium text-slate-600 dark:text-slate-400 mb-6'>
        Your active accounts
      </p>

      <div className='space-y-4'>
        {accounts.length > 0 ? (
          accounts.map((item) => (
            <div 
              key={item.id} 
              className='flex items-center justify-between p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all transform hover:scale-[1.02]'
            >
              <div className='flex items-center gap-4'>
                {getAccountIcon(item.account_name)}
                <div>
                  <p className='font-semibold text-slate-900 dark:text-slate-100'>
                    {item.account_name}
                  </p>
                  <span className='text-xs text-slate-500 dark:text-slate-400'>{item.account_number}</span>
                </div>
              </div>

              <div className='text-right'>
                <p className='text-lg font-bold text-slate-900 dark:text-slate-100'>
                  {formatCurrency(item.account_balance)}
                </p>
                <span className='text-xs text-slate-500 dark:text-slate-400'>
                  Balance
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className='py-8 text-center text-slate-500 dark:text-slate-400'>No accounts found</p>
        )}
      </div>
    </div>
  );
};

export default Accounts;

