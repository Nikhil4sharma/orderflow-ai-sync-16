
import React, { useState, useEffect } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Department } from "@/types";
import { Search, PlusIcon, Filter, ArrowUpDown } from "lucide-react";
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

const Dashboard: React.FC = () => {
  const { orders, filterOrdersByDepartment, filterOrdersByStatus, currentUser } = useOrders();
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

  // Filter orders based on filters and search
  const filteredOrders = filterOrdersByDepartment(departmentFilter)
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
            className="mt-4 sm:mt-0" 
            onClick={() => navigate('/new-order')}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Order
          </Button>
        )}
      </div>

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
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Department
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDepartmentFilter('All')}
                className={departmentFilter === 'All' ? 'bg-muted' : ''}
                disabled={!userCanSeeAllDepartments}
              >
                All Departments
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDepartmentFilter('Sales')}
                className={departmentFilter === 'Sales' ? 'bg-muted' : ''}
              >
                Sales
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDepartmentFilter('Production')}
                className={departmentFilter === 'Production' ? 'bg-muted' : ''}
              >
                Production
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDepartmentFilter('Design')}
                className={departmentFilter === 'Design' ? 'bg-muted' : ''}
              >
                Design
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDepartmentFilter('Prepress')}
                className={departmentFilter === 'Prepress' ? 'bg-muted' : ''}
              >
                Prepress
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setStatusFilter('All')}
                className={statusFilter === 'All' ? 'bg-muted' : ''}
              >
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('New')}
                className={statusFilter === 'New' ? 'bg-muted' : ''}
              >
                New
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('In Progress')}
                className={statusFilter === 'In Progress' ? 'bg-muted' : ''}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('Completed')}
                className={statusFilter === 'Completed' ? 'bg-muted' : ''}
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('On Hold')}
                className={statusFilter === 'On Hold' ? 'bg-muted' : ''}
              >
                On Hold
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('Issue')}
                className={statusFilter === 'Issue' ? 'bg-muted' : ''}
              >
                Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all" onClick={() => setStatusFilter('All')}>All</TabsTrigger>
          <TabsTrigger value="new" onClick={() => setStatusFilter('New')}>New</TabsTrigger>
          <TabsTrigger value="progress" onClick={() => setStatusFilter('In Progress')}>In Progress</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setStatusFilter('Completed')}>Completed</TabsTrigger>
          <TabsTrigger value="issue" onClick={() => setStatusFilter('Issue')}>Issues</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px] cursor-pointer" onClick={() => requestSort('orderNumber')}>
                <div className="flex items-center">
                  Order #
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('clientName')}>
                <div className="flex items-center">
                  Client
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => requestSort('createdAt')}>
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => requestSort('currentDepartment')}>
                <div className="flex items-center">
                  Department
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No orders found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell className="hidden md:table-cell">{format(parseISO(order.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      getStatusColorClass(order.status), 
                      "whitespace-nowrap"
                    )}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{order.currentDepartment}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {order.items.length > 2 
                      ? `${order.items.slice(0, 2).join(', ')} +${order.items.length - 2}` 
                      : order.items.join(', ')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedOrders.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => prevPage()}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                />
              </PaginationItem>
              
              {/* Dynamic pagination items */}
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                let pageNumber: number;
                
                // Logic to show pages around the current page
                if (totalPages <= 5 || currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                // If we would show more than total pages, skip
                if (pageNumber > totalPages) return null;
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      isActive={currentPage === pageNumber}
                      onClick={() => paginate(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {/* Show ellipsis if there are more pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => nextPage()}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
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
