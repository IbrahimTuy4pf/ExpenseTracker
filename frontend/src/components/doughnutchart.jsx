import React, { useEffect } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip, 
} from "recharts";
import Title from "./title";
import useStore from "../store";
import { transactionAPI } from "../services/api";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

const DoughnutChart = () => {
  const { dashboardData, setDashboardData } = useStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await transactionAPI.getDashboard();
        if (data.status === "success") {
          setDashboardData(data) ;
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };


    fetchDashboard();
  }, [setDashboardData]); // here if setDash changes then we rerun this effect 

  const data = [
    { name: "Income", value: dashboardData?.totalIncome || 0 },
    { name: "Expense", value: dashboardData?.totalExpense || 0 },
  ];

  return (
    <div className='glass card-hover rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl flex flex-col items-center animate-fade-in' style={{ animationDelay: '0.1s' }}>
      <Title title='Summary' />

      <ResponsiveContainer width={"100%"} height={400} className='mt-2'>
        <PieChart width={500} height={400}>
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
          <Pie //not complete btw 
            data={data}
            innerRadius={80}
            outerRadius={140}
            fill='#8884d8'
            paddingAngle={3}
            dataKey={"value"}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? '#3b82f6' : '#06b6d4'}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;

