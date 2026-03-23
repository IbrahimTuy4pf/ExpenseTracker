import React from "react";

const Title = ({ title }) => {
  return (
    <h3 className='text-2xl 2xl:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-5'>
      {title}
    </h3>
  );
};

export default Title;

