import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrders } from "@/contexts/OrderContext";
import { Department } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DashboardConfiguration, DashboardElement } from "@/types/dashboardConfig";
import { toast } from "sonner";

const DashboardSettings = () => {
  const { dashboardConfig: initialConfig, updateDashboardConfig } = useOrders();
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfiguration>(
    JSON.parse(JSON.stringify(initialConfig)) // Deep clone to avoid direct mutation
  );
  
  // All available dashboard elements with nice display names
  const dashboardElements: {id: DashboardElement; name: string; description: string}[] = [
    { 
      id: 'financialSummary', 
      name: 'Financial Summary', 
      description: 'Shows payment status, amounts, and financial metrics' 
    },
    { 
      id: 'orderApprovals', 
      name: 'Order Approvals', 
      description: 'Displays orders waiting for approval' 
    },
    { 
      id: 'recentOrders', 
      name: 'Recent Orders', 
      description: 'Lists recently created or updated orders' 
    },
    { 
      id: 'statusSummary', 
      name: 'Status Summary', 
      description: 'Shows order status distribution and statistics' 
    },
    { 
      id: 'taskList', 
      name: 'Task List', 
      description: 'Displays pending tasks and actions needed' 
    },
    { 
      id: 'salesMetrics', 
      name: 'Sales Metrics', 
      description: 'Shows sales performance indicators and trends' 
    },
    { 
      id: 'productionTimeline', 
      name: 'Production Timeline', 
      description: 'Displays production schedule and deadlines' 
    },
    { 
      id: 'deliverySchedule', 
      name: 'Delivery Schedule', 
      description: 'Shows upcoming deliveries and shipping details' 
    },
  ];

  // All departments
  const departments: Department[] = [
    'Sales', 'Design', 'Prepress', 'Production', 'Admin'
  ];

  // Handle checkbox change for an element
  const handleElementToggle = (department: Department, elementId: DashboardElement) => {
    const config = { ...dashboardConfig };
    const deptConfig = { ...config.departmentConfigs[department] };
    
    // Check if the element is already in the array
    const index = deptConfig.visibleElements.indexOf(elementId);
    
    if (index === -1) {
      // Add the element
      deptConfig.visibleElements = [...deptConfig.visibleElements, elementId];
    } else {
      // Remove the element
      deptConfig.visibleElements = deptConfig.visibleElements.filter(id => id !== elementId);
    }
    
    config.departmentConfigs[department] = deptConfig;
    setDashboardConfig(config);
  };
  
  // Check if element is visible for department
  const isElementVisible = (department: Department, elementId: DashboardElement): boolean => {
    return dashboardConfig.departmentConfigs[department].visibleElements.includes(elementId);
  };
  
  // Save configuration
  const saveConfiguration = () => {
    updateDashboardConfig(dashboardConfig);
    toast.success("Dashboard settings updated successfully");
  };
  
  // Reset to default
  const resetToDefault = () => {
    // Reset without using the imported default to avoid reference issues
    const resetConfig: DashboardConfiguration = {
      departmentConfigs: {
        Sales: {
          department: 'Sales',
          visibleElements: [
            'financialSummary',
            'orderApprovals',
            'recentOrders',
            'statusSummary',
            'salesMetrics',
            'deliverySchedule'
          ]
        },
        Design: {
          department: 'Design',
          visibleElements: [
            'orderApprovals',
            'recentOrders',
            'statusSummary',
            'taskList'
          ]
        },
        Prepress: {
          department: 'Prepress',
          visibleElements: [
            'orderApprovals',
            'recentOrders',
            'statusSummary',
            'taskList'
          ]
        },
        Production: {
          department: 'Production',
          visibleElements: [
            'orderApprovals',
            'recentOrders',
            'statusSummary',
            'productionTimeline',
            'taskList'
          ]
        },
        Admin: {
          department: 'Admin' as Department,
          visibleElements: [
            'financialSummary',
            'orderApprovals',
            'recentOrders',
            'statusSummary',
            'taskList',
            'salesMetrics',
            'productionTimeline',
            'deliverySchedule'
          ]
        }
      }
    };
    
    setDashboardConfig(resetConfig);
    toast.info("Settings reset to default values");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configure Department Dashboards</CardTitle>
          <CardDescription>
            Control which dashboard elements are visible to each department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Sales">
            <TabsList className="mb-6">
              {departments.map((dept) => (
                <TabsTrigger key={dept} value={dept}>
                  {dept}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {departments.map((dept) => (
              <TabsContent key={dept} value={dept} className="space-y-6">
                <h3 className="text-lg font-medium mb-4">{dept} Department Dashboard</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardElements.map((element) => (
                    <div 
                      key={element.id} 
                      className="flex items-start space-x-2 p-4 rounded-md border hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox 
                        id={`${dept}-${element.id}`}
                        checked={isElementVisible(dept, element.id)}
                        onCheckedChange={() => handleElementToggle(dept, element.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor={`${dept}-${element.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {element.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {element.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex justify-end space-x-2 mt-8">
            <Button variant="outline" onClick={resetToDefault}>
              Reset to Default
            </Button>
            <Button onClick={saveConfiguration}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
