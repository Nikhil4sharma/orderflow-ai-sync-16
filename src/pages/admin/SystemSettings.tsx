
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const SystemSettings: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>

      <div className="mb-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Dashboard Configuration</CardTitle>
            <CardDescription>
              Configure what each department can see on their dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Control which dashboard elements are visible to different departments.
              Configure financial visibility, approval workflows, and department-specific views.
            </p>
            <Link to="/admin/dashboard-settings">
              <Button className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Configure Dashboard Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email Notifications</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  Basic information about your system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" placeholder="Your Company Name" defaultValue="Chhapai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input id="site-url" placeholder="https://yourcompany.com" defaultValue="https://chhapai.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" placeholder="support@yourcompany.com" defaultValue="support@chhapai.com" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="email">
          <div className="grid gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure which events trigger email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">New Order Notification</Label>
                    <span className="text-sm text-muted-foreground">
                      Send email when a new order is created
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Payment Notification</Label>
                    <span className="text-sm text-muted-foreground">
                      Send email when payment is received
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Status Update Notification</Label>
                    <span className="text-sm text-muted-foreground">
                      Send email when order status changes
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Approval Request Notification</Label>
                    <span className="text-sm text-muted-foreground">
                      Send email when approval is requested
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Dispatch Notification</Label>
                    <span className="text-sm text-muted-foreground">
                      Send email when order is dispatched
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="workflow">
          <div className="grid gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Workflow Settings</CardTitle>
                <CardDescription>
                  Configure the order processing workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Require Payment Before Production</Label>
                    <span className="text-sm text-muted-foreground">
                      Orders must be paid before moving to production
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Auto-Approve Orders Under ₹5,000</Label>
                    <span className="text-sm text-muted-foreground">
                      Orders under ₹5,000 are automatically approved
                    </span>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Design Approval Required</Label>
                    <span className="text-sm text-muted-foreground">
                      Design must be approved before proceeding to prepress
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="block">Prepress Approval Required</Label>
                    <span className="text-sm text-muted-foreground">
                      Prepress must be approved before proceeding to production
                    </span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
