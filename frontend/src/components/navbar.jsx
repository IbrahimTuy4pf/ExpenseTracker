import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiCurrencyLine } from "react-icons/ri";
import { MdOutlineKeyboardArrowDown, MdMenu, MdClose } from "react-icons/md";
import ThemeSwitch from "./themeswitch";
import useStore from "../store";

const links = [
  { name: "Dashboard", path: "/" },
  { name: "Transactions", path: "/transactions" },
  { name: "Accounts", path: "/accounts" },
  { name: "Settings", path: "/settings" },
];

const Navbar = () => {
  const { user, logout } = useStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className='w-full flex items-center justify-between py-4 relative glass rounded-2xl px-6 mb-6 shadow-lg'>
      <Link to="/" className='flex items-center gap-3 cursor-pointer group'>
        <div className='relative'>
          <div className='w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3'>
            <RiCurrencyLine className='text-white text-2xl md:text-3xl transition-transform group-hover:rotate-12' />
          </div>
          <div className='absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse'></div>
        </div>
        <div>
          <span className='text-xl md:text-2xl font-extrabold gradient-text'>
            FinTrack
          </span>
          <p className='text-xs text-slate-500 dark:text-slate-400 hidden md:block font-semibold mt-0.5'>Smart Finance Management</p>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl'>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              isActive(link.path)
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            } px-5 py-2 rounded-lg font-medium transition-all duration-200`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className='md:hidden text-2xl text-black dark:text-white'
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='absolute top-full left-0 right-0 glass border-t border-white/20 md:hidden z-50 mt-2 rounded-2xl shadow-xl'>
          <div className='flex flex-col p-4 gap-2'>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                } px-4 py-3 rounded-xl font-medium transition-all`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className='flex items-center gap-4 md:gap-6'>
        <ThemeSwitch />

        <div className='flex items-center gap-3'>
          <div className='w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white dark:ring-slate-800'>
            {user?.firstname?.[0]?.toUpperCase() || "U"}
          </div>
          <div className='hidden md:block'>
            <p className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
              {user?.firstname || "User"} {user?.lastname || ""}
            </p>
            <span className='text-xs text-slate-500 dark:text-slate-400'>
              {user?.email || ""}
            </span>
          </div>
          <div className='hidden md:block relative group'>
            <MdOutlineKeyboardArrowDown className='text-xl text-slate-600 dark:text-slate-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors' />
            <div className='absolute right-0 mt-2 w-36 glass rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden'>
              <button
                onClick={() => logout()}
                className='w-full text-left px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
