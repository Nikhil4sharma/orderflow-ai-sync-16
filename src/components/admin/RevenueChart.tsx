import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order } from '@/types';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, isSameMonth } from 'date-fns';

interface RevenueChartProps {
  orders: Order[];
  height?: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ orders, height = 300 }) => {
  // Defensive: Only use orders with valid createdAt string
  const validOrders = orders.filter(order => typeof order.createdAt === 'string' && order.createdAt);
  const chartData = useMemo(() => {
    if (validOrders.length === 0) {
      return [];
    }
    const sortedOrders = [...validOrders].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const startDate = startOfMonth(parseISO(sortedOrders[0].createdAt));
    const endDate = endOfMonth(parseISO(sortedOrders[sortedOrders.length - 1].createdAt));
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    return months.map(month => {
      const monthOrders = sortedOrders.filter(order => 
        isSameMonth(parseISO(order.createdAt), month)
      );
      const revenue = monthOrders.reduce((sum, order) => sum + order.amount, 0);
      const paidAmount = monthOrders.reduce((sum, order) => sum + order.paidAmount, 0);
      return {
        month: format(month, 'MMM yyyy'),
        revenue,
        paidAmount
      };
    });
  }, [validOrders]);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-72">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
        />
        <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="paidAmount" name="Paid Amount" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
