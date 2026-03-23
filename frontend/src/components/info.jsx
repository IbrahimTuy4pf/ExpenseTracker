import React from "react";
import { IoFilterSharp, IoSearchOutline } from "react-icons/io5";

const Info = ({ title, subTitle }) => {
  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between py-6 mb-10'>
      <div className='mb-6 md:mb-0 animate-fade-in'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 gradient-text'>
          {title}
        </h1>
        <p className='text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium'>{subTitle}</p>
      </div>

      <div className='flex items-center gap-3 animate-fade-in' style={{ animationDelay: '0.2s' }}>
        <div className='flex items-center gap-2 glass border border-white/30 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all focus-within:ring-2 focus-within:ring-blue-500'>
          <IoSearchOutline className='text-xl text-slate-500 dark:text-slate-400' />
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400 w-32 md:w-40 font-medium'
          />
        </div>

        <button className='flex items-center gap-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 py-3 px-6 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95'>
          <IoFilterSharp size={20} />
          <span className='text-sm hidden md:inline'>Filter</span>
        </button>
      </div>
    </div>
  );
};

export default Info;

