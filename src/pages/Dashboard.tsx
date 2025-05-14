import React, { useState, useEffect } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { useUsers } from "@/contexts/UserContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusSummaryCard from "@/components/StatusSummaryCard";
import RecentOrdersList from "@/components/RecentOrdersList";
import FinancialSummaryCard from "@/components/FinancialSummaryCard";
import DashboardElement from "@/components/DashboardElement";
import { OrderFilters } from "@/types";

const DashboardElement: React.FC<DashboardElementProps> = ({ children, elementId, title }) => {
  const { canUserSeeElement } = useOrders();
  
  if (!canUserSeeElement(elementId)) {
    return null;
  }
  
  return children;
};

const Dashboard = () => {
  const { orders, loading, getFilteredOrders } = useOrders();
  const { currentUser } = useUsers();
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<OrderFilters>({});
  
  // Calculate dashboard metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;
  const inProgressOrders = orders.filter(order => order.status === 'In Progress').length;
  const pendingOrders = orders.filter(order => order.status === 'Pending Approval').length;
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const collectedRevenue = orders.reduce((sum, order) => sum + order.paidAmount, 0);
  const pendingRevenue = totalRevenue - collectedRevenue;
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Department-specific metrics
  const departmentOrders = orders.filter(order => 
    order.currentDepartment === currentUser?.department
  );
  
  const departmentOrderCount = departmentOrders.length;
  
  // Task list for current user's department
  const taskList = departmentOrders
    .filter(order => order.status === 'In Progress')
    .slice(0, 5);
  
  if (loading) {
    return <div>Loading dashboard...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/orders">View All Orders</Link>
          </Button>
          <CanAccess permission="create_orders">
            <Button asChild size="sm">
              <Link to="/new-order">Create Order</Link>
            </Button>
          </CanAccess>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="department">My Department</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardElement elementId="total-orders" title="Total Orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(Math.random() * 10)}% from last month
                  </p>
                </CardContent>
              </Card>
            </DashboardElement>
            
            <DashboardElement elementId="completed-orders" title="Completed Orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {((completedOrders / totalOrders) * 100).toFixed(1)}% completion rate
                  </p>
                </CardContent>
              </Card>
            </DashboardElement>
            
            <DashboardElement elementId="in-progress-orders" title="In Progress Orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inProgressOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {((inProgressOrders / totalOrders) * 100).toFixed(1)}% of total orders
                  </p>
                </CardContent>
              </Card>
            </DashboardElement>
            
            <DashboardElement elementId="pending-orders" title="Pending Orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
            </DashboardElement>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <DashboardElement elementId="financial-summary" title="Financial Summary">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>Total Revenue</span>
                      </div>
                      <span className="font-bold">${totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span>Collected</span>
                      </div>
                      <span className="font-bold">${collectedRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-amber-500" />
                        <span>Pending</span>
                      </div>
                      <span className="font-bold">${pendingRevenue.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Collection Progress</span>
                        <span>{((collectedRevenue / totalRevenue) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(collectedRevenue / totalRevenue) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <DashboardElement elementId="status-summary" title="Status Summary">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Status Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-green-500">Completed</Badge>
                        </div>
                        <span>{completedOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-blue-500">In Progress</Badge>
                        </div>
                        <span>{inProgressOrders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-amber-500">On Hold</Badge>
                        </div>
                        <span>{orders.filter(order => order.status === 'On Hold').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-red-500">Issue</Badge>
                        </div>
                        <span>{orders.filter(order => order.status === 'Issue').length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2 bg-purple-500">Pending Approval</Badge>
                        </div>
                        <span>{orders.filter(order => order.status === 'Pending Approval').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DashboardElement>
            </DashboardElement>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardElement elementId="payment-progress" title="Payment Progress">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-green-500">Paid</Badge>
                      </div>
                      <span>{orders.filter(order => order.paymentStatus === 'Paid').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-amber-500">Partial</Badge>
                      </div>
                      <span>{orders.filter(order => order.paymentStatus === 'Partial').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2 bg-red-500">Not Paid</Badge>
                      </div>
                      <span>{orders.filter(order => order.paymentStatus === 'Not Paid').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DashboardElement>
            
            <DashboardElement elementId="task-list" title="Task List">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Task List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-4">
                      {taskList.length > 0 ? (
                        taskList.map(task => (
                          <div key={task.id} className="flex items-center justify-between">
                            <div>
                              <Link to={`/orders/${task.id}`} className="font-medium hover:underline">
                                {task.orderNumber}
                              </Link>
                              <p className="text-sm text-muted-foreground">{task.clientName}</p>
                            </div>
                            <Badge variant="outline">{task.status}</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground">No tasks for your department</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </DashboardElement>
          </div>
          
          <DashboardElement elementId="recent-orders" title="Recent Orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-6">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{order.clientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Link to={`/orders/${order.id}`} className="font-medium hover:underline">
                              {order.orderNumber}
                            </Link>
                            <p className="text-sm text-muted-foreground">{order.clientName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">${order.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              order.status === 'Completed' ? 'default' : 
                              order.status === 'In Progress' ? 'secondary' : 
                              order.status === 'Issue' ? 'destructive' : 
                              'outline'
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {recentOrders.length === 0 && (
                      <p className="text-center text-muted-foreground">No recent orders</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </DashboardElement>
        </TabsContent>
        
        <TabsContent value="department" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentOrderCount}</div>
                <p className="text-xs text-muted-foreground">
                  {((departmentOrderCount / totalOrders) * 100).toFixed(1)}% of total orders
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {departmentOrders.filter(order => order.status === 'In Progress').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {departmentOrders.filter(order => order.status === 'Completed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {departmentOrders.filter(order => order.status === 'Issue').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Needs resolution
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Department Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-6">
                  {departmentOrders.length > 0 ? (
                    departmentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{order.clientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Link to={`/orders/${order.id}`} className="font-medium hover:underline">
                              {order.orderNumber}
                            </Link>
                            <p className="text-sm text-muted-foreground">{order.clientName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">${order.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              order.status === 'Completed' ? 'default' : 
                              order.status === 'In Progress' ? 'secondary' : 
                              order.status === 'Issue' ? 'destructive' : 
                              'outline'
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No orders for your department</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
