
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { OrderStatus } from '@/types';

interface OrderStatusPieChartProps {
  data: Record<OrderStatus, number>;
}

export const OrderStatusPieChart: React.FC<OrderStatusPieChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // Custom colors for each status
  const COLORS = {
    'New': '#8884d8',
    'In Progress': '#82ca9d',
    'Completed': '#4CAF50',
    'On Hold': '#ff9800',
    'Issue': '#f44336',
    'Verified': '#2196F3',
    'Dispatched': '#9C27B0'
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
              fill={COLORS[entry.name as OrderStatus] || '#8884d8'} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, 'Orders']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
