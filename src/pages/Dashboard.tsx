import React, { useState, useEffect } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Department } from "@/types";
import { Search, PlusIcon, Filter, ArrowUpDown, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusColorClass } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import DashboardApprovalSection from "@/components/DashboardApprovalSection";

const Dashboard: React.FC = () => {
  const { orders, currentUser } = useOrders();
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Set initial department filter based on user's department
  useEffect(() => {
    if (currentUser && currentUser.department) {
      setDepartmentFilter(currentUser.department);
    }
  }, [currentUser]);

  // Define the limited set of status filters
  const allowedStatuses = ["In Progress", "Completed", "Issue"];

  // Filter orders based on filters and search
  const filteredOrders = orders
    .filter(order => departmentFilter === 'All' ? true : order.currentDepartment === departmentFilter)
    .filter(order => statusFilter === 'All' ? true : order.status === statusFilter)
    .filter(order => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(search) ||
        order.clientName.toLowerCase().includes(search) ||
        order.items.some(item => item.toLowerCase().includes(search))
      );
    });

  // Only show orders for the user's department unless they're an admin
  const userCanSeeAllDepartments = currentUser.role === 'Admin';
  const visibleOrders = userCanSeeAllDepartments
    ? filteredOrders
    : filteredOrders.filter(order => order.currentDepartment === currentUser.department);

  // Sort the orders
  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...visibleOrders];
    if (sortConfig !== null) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [visibleOrders, sortConfig]);

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">OrderFlow Dashboard</h1>
          <p className="text-muted-foreground">
            {sortedOrders.length} {sortedOrders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>
        {/* Only show New Order button for Sales team and Admins */}
        {(currentUser.department === 'Sales' || currentUser.role === 'Admin') && (
          <Button 
            className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90" 
            onClick={() => navigate('/new-order')}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Order
          </Button>
        )}
      </div>

      {/* Approval section for Sales team and Admins */}
      {(currentUser.department === 'Sales' || currentUser.role === 'Admin') && (
        <DashboardApprovalSection className="mb-8" />
      )}

      {/* Search and Filter Section */}
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by number, client, or items..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Department</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setDepartmentFilter('All')}>
                {departmentFilter === 'All' && '✓ '}All Departments
              </DropdownMenuItem>
              {userCanSeeAllDepartments && (
                <>
                  <DropdownMenuItem onClick={() => setDepartmentFilter('Sales')}>
                    {departmentFilter === 'Sales' && '✓ '}Sales
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDepartmentFilter('Design')}>
                    {departmentFilter === 'Design' && '✓ '}Design
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDepartmentFilter('Prepress')}>
                    {departmentFilter === 'Prepress' && '✓ '}Prepress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDepartmentFilter('Production')}>
                    {departmentFilter === 'Production' && '✓ '}Production
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setStatusFilter('All')}>
                {statusFilter === 'All' && '✓ '}All Statuses
              </DropdownMenuItem>
              {allowedStatuses.map(status => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  {statusFilter === status && '✓ '}{status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => requestSort('createdAt')}>
                Date {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('clientName')}>
                Client Name {sortConfig?.key === 'clientName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('status')}>
                Status {sortConfig?.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </DropdownMenuItem>
              {userCanSeeAllDepartments && (
                <DropdownMenuItem onClick={() => requestSort('currentDepartment')}>
                  Department {sortConfig?.key === 'currentDepartment' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] cursor-pointer" onClick={() => requestSort('orderNumber')}>
                <div className="flex items-center">
                  Order #
                  {sortConfig?.key === 'orderNumber' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('clientName')}>
                <div className="flex items-center">
                  Client
                  {sortConfig?.key === 'clientName' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => requestSort('createdAt')}>
                <div className="flex items-center">
                  Date
                  {sortConfig?.key === 'createdAt' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
                <div className="flex items-center">
                  Status
                  {sortConfig?.key === 'status' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden md:table-cell text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={order.clientName}>
                    {order.clientName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(parseISO(order.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "whitespace-nowrap",
                      getStatusColorClass(order.status)
                    )}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="font-normal">
                      {order.currentDepartment}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    ₹{order.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Mobile Optimized */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={prevPage}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {/* Responsive pagination - show fewer items on mobile */}
              <div className="hidden sm:flex">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Complex logic to show appropriate page numbers
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  // Only show if the calculated page number is valid
                  if (pageNumber > 0 && pageNumber <= totalPages) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() => paginate(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
              </div>
              
              {/* Mobile simplified pagination */}
              <PaginationItem className="sm:hidden">
                <PaginationLink isActive>
                  {currentPage} / {totalPages}
                </PaginationLink>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  onClick={nextPage}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
