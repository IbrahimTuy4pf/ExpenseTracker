import React, { useEffect } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "./title";
import useStore from "../store";
import { transactionAPI } from "../services/api";

const Chart = () => {
  const { dashboardData, setDashboardData } = useStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await transactionAPI.getDashboard();
        if (data.status === "success") {
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard:", data.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchDashboard();
  }, [setDashboardData]);

  const data = dashboardData?.chartData || [];

  return (
    <div className='glass card-hover rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl animate-fade-in'>
      <Title title='Transaction Activity' />

      <ResponsiveContainer width={"100%"} height={400} className='mt-6'>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' className='dark:stroke-slate-700' />
          <YAxis stroke='#64748b' className='dark:stroke-slate-400' />
          <XAxis dataKey="label" stroke='#64748b' className='dark:stroke-slate-400' />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}
            className='dark:bg-slate-800 dark:border-slate-700'
          />
          <Legend />
          <Line 
            type='monotone' 
            dataKey={"income"} 
            stroke='#3b82f6' 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Income" 
          />
          <Line 
            type='monotone' 
            dataKey={"expense"} 
            stroke='#06b6d4' 
            strokeWidth={3}
            dot={{ fill: '#06b6d4', r: 4 }}
            name="Expense" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

