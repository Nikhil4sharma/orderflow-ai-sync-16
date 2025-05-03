
import React from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, User, Shield, Mail, Building, SlidersHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useOrders();

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-col items-center pb-6">
              <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <User className="h-12 w-12" />
              </div>
              <CardTitle>{currentUser.name}</CardTitle>
              <CardDescription className="text-center">
                {currentUser.department} • {currentUser.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{currentUser.email || "No email provided"}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{currentUser.department}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{currentUser.role}</span>
                </div>
                
                <Separator className="my-3" />
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/settings")}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and access rights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Access Rights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg bg-accent/10">
                    <div className="font-medium">Order Management</div>
                    <div className="text-sm text-muted-foreground">
                      {currentUser.role === "Admin" 
                        ? "Full access to all orders" 
                        : `Access to ${currentUser.department} department orders`}
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-accent/10">
                    <div className="font-medium">Department Access</div>
                    <div className="text-sm text-muted-foreground">
                      {currentUser.department}
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg bg-accent/10">
                    <div className="font-medium">User Creation</div>
                    <div className="text-sm text-muted-foreground">
                      {currentUser.role === "Admin" ? "Can create users" : "Cannot create users"}
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-accent/10">
                    <div className="font-medium">Financial Access</div>
                    <div className="text-sm text-muted-foreground">
                      {currentUser.department === "Sales" || currentUser.role === "Admin" 
                        ? "Full access" 
                        : "Limited access"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Account Security</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  For security reasons, please contact an administrator if you need to change your password or update account details.
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => navigate("/change-password")}>
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
