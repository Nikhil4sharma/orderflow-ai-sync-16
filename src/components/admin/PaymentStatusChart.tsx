
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PaymentStatus } from '@/types';

interface PaymentStatusChartProps {
  data: Record<PaymentStatus, number>;
}

export const PaymentStatusChart: React.FC<PaymentStatusChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // Custom colors for each status
  const COLORS = {
    'Not Paid': '#f44336',
    'Partially Paid': '#ff9800',
    'Paid': '#4CAF50'
  };

  if (chartData.every(item => item.value === 0)) {
    return <div className="flex items-center justify-center h-60">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.name as PaymentStatus] || '#8884d8'} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, 'Orders']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
