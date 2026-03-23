import React from "react";
import Info from "../components/info";
import Stats from "../components/stats";
import Chart from "../components/chart";
import DoughnutChart from "../components/doughnutchart";
import Transactions from "../components/transactions";
import Accounts from "../components/accounts";
import ExpenseAdvisor from "../components/ExpenseAdvisor";

const Dashboard = () => {
  return (
    <div className='px-0'>
      <Info
        title='Dashboard'
        subTitle='Monitor your financial activities'
      />
      <Stats />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        <div className='lg:col-span-2'>
          <Chart />
        </div>
        <div className='lg:col-span-1'>
          <DoughnutChart />
        </div>
      </div>
    
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        <div className='lg:col-span-2'>
          <Transactions />
        </div>
        <div className='lg:col-span-1'>
          <Accounts />
        </div>
      </div>

      <div className='mb-6'>
        <Info
          title='Expense Advisor'
          subTitle='Get personalized advice on your spending habits'
        />
        <ExpenseAdvisor />
      </div>
    </div>
  );
};

export default Dashboard;

