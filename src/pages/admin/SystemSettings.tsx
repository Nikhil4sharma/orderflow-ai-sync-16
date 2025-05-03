
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { useTheme } from "@/components/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Settings, Save, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SystemSettings: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useOrders();
  const { theme, setTheme } = useTheme();
  
  // System settings state
  const [companyName, setCompanyName] = useState("Order Management System");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [defaultTheme, setDefaultTheme] = useState(theme);
  const [autoLogout, setAutoLogout] = useState(30);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Check if current user is admin
  if (currentUser.role !== "Admin") {
    toast.error("Access denied. Admin privileges required.");
    navigate("/");
    return null;
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update theme
    setTheme(defaultTheme);
    
    // In a real app, would save these settings to a database or config
    toast.success("Settings saved successfully");
  };

  const handleResetSettings = () => {
    // Reset form to defaults
    setCompanyName("Order Management System");
    setEmailNotifications(true);
    setDefaultTheme(theme);
    setAutoLogout(30);
    setMaintenanceMode(false);
    
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Dashboard
      </Button>
      
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure global application settings
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic application configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultTheme">Default Theme</Label>
                <Select
                  value={defaultTheme}
                  onValueChange={setDefaultTheme}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="autoLogout">Auto Logout (minutes)</Label>
                <Input
                  id="autoLogout"
                  type="number"
                  min={5}
                  max={120}
                  value={autoLogout}
                  onChange={(e) => setAutoLogout(parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="block">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Blocks non-admin access
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              
              <CardFooter className="px-0 pt-6 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleResetSettings}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <Switch id="twoFactorAuth" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="passwordExpiry">Password Expiry</Label>
                  <Switch id="passwordExpiry" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="loginAttempts">Login Attempt Limits</Label>
                  <Switch id="loginAttempts" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system status and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-500">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <span className="text-green-500">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API:</span>
                  <span className="text-green-500">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
