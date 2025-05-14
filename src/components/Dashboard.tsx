
import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Department, OrderStatus, PaymentStatus, OrderFilters } from '@/types';
import { formatIndianRupees } from '@/lib/utils';
import { Search, ArrowUpDown, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import { DateRange } from 'react-day-picker';

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'status', label: 'Status' },
  { value: 'clientName', label: 'Client Name' },
  { value: 'orderNumber', label: 'Order Number' },
];

const Dashboard: React.FC = () => {
  const { orders, getFilteredOrders, getSortedOrders, currentUser } = useOrders();
  const [filters, setFilters] = useState<OrderFilters>({
    department: undefined,
    status: undefined,
    paymentStatus: undefined,
    dateRange: undefined,
    amountRange: undefined,
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status' | 'clientName' | 'orderNumber'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Apply filters and sorting
  const filteredOrders = getFilteredOrders(filters);
  const sortedOrders = getSortedOrders(filteredOrders, sortBy, sortDirection);

  // Handle filter changes
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'amountRange.min' || name === 'amountRange.max') {
      setFilters(prev => ({
        ...prev,
        amountRange: {
          ...prev.amountRange,
          [name === 'amountRange.min' ? 'min' : 'max']: value === '' ? undefined : Number(value)
        }
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  // Handle sort changes
  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                name="searchTerm"
                className="pl-8"
              />
            </div>

            {/* Department Filter */}
            <Select
              value={filters.department}
              onValueChange={(value) => handleFilterChange({ target: { name: 'department', value } } as React.ChangeEvent<HTMLSelectElement>)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Prepress">Prepress</SelectItem>
                <SelectItem value="Production">Production</SelectItem>
                {currentUser?.role === 'Admin' && (
                  <SelectItem value="Admin">Admin</SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange({ target: { name: 'status', value } } as React.ChangeEvent<HTMLSelectElement>)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Dispatched">Dispatched</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Status Filter */}
            <Select
              value={filters.paymentStatus}
              onValueChange={(value) => handleFilterChange({ target: { name: 'paymentStatus', value } } as React.ChangeEvent<HTMLSelectElement>)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Paid">Not Paid</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <DateRangePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            />

            {/* Amount Range */}
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Amount"
                value={filters.amountRange?.min || ''}
                onChange={handleFilterChange}
                name="amountRange.min"
              />
              <Input
                type="number"
                placeholder="Max Amount"
                value={filters.amountRange?.max || ''}
                onChange={handleFilterChange}
                name="amountRange.max"
              />
            </div>
          </div>
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium">Sort By:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1"
            >
              {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange('orderNumber')}
                      className="flex items-center gap-1"
                    >
                      Order #
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-left p-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange('clientName')}
                      className="flex items-center gap-1"
                    >
                      Client
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-left p-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange('date')}
                      className="flex items-center gap-1"
                    >
                      Date
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-left p-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange('amount')}
                      className="flex items-center gap-1"
                    >
                      Amount
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-left p-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleSortChange('status')}
                      className="flex items-center gap-1"
                    >
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="text-left p-2">Department</th>
                  <th className="text-left p-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{order.orderNumber}</td>
                    <td className="p-2">{order.clientName}</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">{formatIndianRupees(order.amount)}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{order.currentDepartment}</td>
                    <td className="p-2">{order.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
