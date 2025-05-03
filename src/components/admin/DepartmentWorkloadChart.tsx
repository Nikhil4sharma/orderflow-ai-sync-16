
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DepartmentWorkloadChartProps {
  data: Record<string, number>;
  height?: number;
}

export const DepartmentWorkloadChart: React.FC<DepartmentWorkloadChartProps> = ({ data, height = 300 }) => {
  const chartData = Object.entries(data).map(([department, count]) => ({
    department,
    orders: count
  }));

  if (chartData.length === 0 || chartData.every(item => item.orders === 0)) {
    return <div className="flex items-center justify-center h-60">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip formatter={(value) => [value, 'Orders']} />
        <Legend />
        <Bar dataKey="orders" name="Active Orders" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
