import React, { useEffect, useState } from "react";
import Info from "../components/info";
import Title from "../components/title";
import { FaBtc, FaCcMastercard, FaPaypal, FaPlus } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";
import { accountAPI } from "../services/api";
import useStore from "../store";

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
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    account_number: "",
    amount: "",
  });
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    source: "",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountAPI.getAccounts();
      if (data.status === "success") {
        setAccounts(data.data || []);
      } else {
        console.error("Failed to fetch accounts:", data.message);
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const data = await accountAPI.createAccount(
        formData.name,
        formData.account_number,
        parseFloat(formData.amount)
      );
      if (data.status === "success") {
        setShowModal(false);
        setFormData({ name: "", account_number: "", amount: "" });
        fetchAccounts();
      } else {
        alert(data.message || "Failed to create account");
      }
    } catch (error) {
      alert(error.message || "Failed to create account");
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    try {
      const data = await accountAPI.addMoney(
        selectedAccount.id,
        parseFloat(addMoneyAmount)
      );
      if (data.status === "success") {
        setShowAddMoneyModal(false);
        setAddMoneyAmount("");
        setSelectedAccount(null);
        fetchAccounts();
      } else {
        alert(data.message || "Failed to add money");
      }
    } catch (error) {
      alert(error.message || "Failed to add money");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const data = await accountAPI.addExpense(
        selectedAccount.id,
        parseFloat(expenseData.amount),
        expenseData.description,
        expenseData.source || selectedAccount.account_name
      );
      if (data.status === "success") {
        setShowAddExpenseModal(false);
        setExpenseData({ amount: "", description: "", source: "" });
        setSelectedAccount(null);
        fetchAccounts();
      } else {
        alert(data.message || "Failed to add expense");
      }
    } catch (error) {
      alert(error.message || "Failed to add expense");
    }
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
      <div className='flex items-center justify-between mb-6'>
        <Info title='Accounts' subTitle='Manage your accounts and balances' />
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105'
        >
          <FaPlus /> Create Account
        </button>
      </div>

      {loading ? (
        <div className='text-center py-12 text-gray-500'>Loading...</div>
      ) : accounts.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className='glass card-hover rounded-2xl p-6 border border-white/20 shadow-xl animate-fade-in'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className='flex items-center justify-between mb-4'>
                {getAccountIcon(account.account_name)}
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setSelectedAccount(account);
                      setShowAddExpenseModal(true);
                    }}
                    className='text-sm bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all'
                  >
                    Add Expense
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAccount(account);
                      setShowAddMoneyModal(true);
                    }}
                    className='text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all'
                  >
                    Add Money
                  </button>
                </div>
              </div>
              <h3 className='text-xl font-semibold text-black dark:text-gray-300 mb-2'>
                {account.account_name}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                {account.account_number}
              </p>
              <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
                <p className='text-2xl font-bold text-black dark:text-gray-300'>
                  {formatCurrency(account.account_balance)}
                </p>
                <span className='text-sm text-gray-600 dark:text-gray-500'>
                  Account Balance
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 text-gray-500'>
          No accounts found. Create your first account!
        </div>
      )}

      {/* Create Account Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='glass rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl'>
            <h2 className='text-2xl font-bold mb-6 text-black dark:text-white'>
              Create New Account
            </h2>
            <form onSubmit={handleCreateAccount}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Account Name
                </label>
                <input
                  type='text'
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                  placeholder='e.g., Savings Account'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Account Number
                </label>
                <input
                  type='text'
                  required
                  value={formData.account_number}
                  onChange={(e) =>
                    setFormData({ ...formData, account_number: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                  placeholder='e.g., 1234567890'
                />
              </div>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Initial Balance
                </label>
                <input
                  type='number'
                  required
                  min='0'
                  step='0.01'
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                  placeholder='0.00'
                />
              </div>
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: "", account_number: "", amount: "" });
                  }}
                  className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg'
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && selectedAccount && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='glass rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl'>
            <h2 className='text-2xl font-bold mb-6 text-black dark:text-white'>
              Add Money to {selectedAccount.account_name}
            </h2>
            <form onSubmit={handleAddMoney}>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Amount
                </label>
                <input
                  type='number'
                  required
                  min='0.01'
                  step='0.01'
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                  placeholder='0.00'
                />
              </div>
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowAddMoneyModal(false);
                    setAddMoneyAmount("");
                    setSelectedAccount(null);
                  }}
                  className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg'
                >
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && selectedAccount && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='glass rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl'>
            <h2 className='text-2xl font-bold mb-6 text-black dark:text-white'>
              Add Expense to {selectedAccount.account_name}
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
              Current Balance: {formatCurrency(selectedAccount.account_balance)}
            </p>
            <form onSubmit={handleAddExpense}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Amount <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  required
                  min='0.01'
                  step='0.01'
                  max={selectedAccount.account_balance}
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                  placeholder='0.00'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Description <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  required
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                  placeholder='e.g., Groceries, Rent, Utilities'
                />
              </div>
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Category/Source (Optional)
                </label>
                <input
                  type='text'
                  value={expenseData.source}
                  onChange={(e) => setExpenseData({ ...expenseData, source: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-black dark:text-white'
                  placeholder={selectedAccount.account_name}
                />
              </div>
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowAddExpenseModal(false);
                    setExpenseData({ amount: "", description: "", source: "" });
                    setSelectedAccount(null);
                  }}
                  className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-semibold shadow-lg'
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

