
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";

const SystemSettings: React.FC = () => {
  const { currentUser } = useOrders();
  const { theme, setTheme } = useTheme();
  
  // Email notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    orderCreated: true,
    statusUpdated: true,
    paymentReceived: true,
    dailySummary: false,
  });
  
  // System performance settings
  const [cacheTimeout, setCacheTimeout] = useState<number[]>([30]);
  const [autoLogout, setAutoLogout] = useState(true);
  
  // Company information
  const [companyInfo, setCompanyInfo] = useState({
    name: "PrintFlow Solutions",
    email: "contact@printflow.com",
    phone: "+1 (555) 123-4567",
    address: "123 Print Street, Design City, 12345",
  });
  
  // Handle company info change
  const handleCompanyInfoChange = (field: keyof typeof companyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle notification toggle
  const handleNotificationChange = (setting: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, you would save these to a database or backend
    toast.success("Settings saved successfully!");
  };

  // Handle theme change
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  if (!currentUser || currentUser.role !== "Admin") {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p>You do not have permission to access system settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Customize the appearance of the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="flex space-x-4">
                  <Button 
                    variant={theme === "light" ? "default" : "outline"} 
                    onClick={() => handleThemeChange("light")}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"} 
                    onClick={() => handleThemeChange("dark")}
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={theme === "system" ? "default" : "outline"} 
                    onClick={() => handleThemeChange("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Email Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>
              Configure which email notifications are sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Created</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications when new orders are created
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications.orderCreated}
                  onCheckedChange={() => handleNotificationChange("orderCreated")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications when an order's status changes
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications.statusUpdated}
                  onCheckedChange={() => handleNotificationChange("statusUpdated")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications when payments are processed
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications.paymentReceived}
                  onCheckedChange={() => handleNotificationChange("paymentReceived")}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Daily report of orders and activities
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications.dailySummary}
                  onCheckedChange={() => handleNotificationChange("dailySummary")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>
              Adjust settings that affect system performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cache Timeout (minutes)</Label>
                  <span>{cacheTimeout[0]}</span>
                </div>
                <Slider 
                  value={cacheTimeout} 
                  onValueChange={setCacheTimeout} 
                  max={60}
                  step={5}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Logout</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out users after 30 minutes of inactivity
                  </p>
                </div>
                <Switch 
                  checked={autoLogout}
                  onCheckedChange={setAutoLogout}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name"
                  value={companyInfo.name}
                  onChange={(e) => handleCompanyInfoChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email Address</Label>
                <Input 
                  id="company-email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => handleCompanyInfoChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone">Phone Number</Label>
                <Input 
                  id="company-phone"
                  value={companyInfo.phone}
                  onChange={(e) => handleCompanyInfoChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Business Address</Label>
                <Input 
                  id="company-address"
                  value={companyInfo.address}
                  onChange={(e) => handleCompanyInfoChange("address", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default SystemSettings;
