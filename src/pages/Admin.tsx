
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User, ArrowLeft, Shield, UserPlus, Settings, FolderPlus, LayoutDashboard } from "lucide-react";
import { Department, User as UserType } from "@/types";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { users, addUser, currentUser } = useOrders();
  
  // New user form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState<Department>("Sales");
  const [role, setRole] = useState<"Admin" | "Member">("Member");
  
  // Check if current user is admin
  if (currentUser.role !== "Admin") {
    toast.error("Access denied. Admin privileges required.");
    navigate("/");
    return null;
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Check if email is already in use
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      toast.error("Email is already in use");
      return;
    }
    
    // Create new user
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In a real app, this would be hashed
      department,
      role
    };
    
    // Add user
    addUser(newUser);
    
    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setDepartment("Sales");
    setRole("Member");
    
    toast.success("User created successfully");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              Manage users and system settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/admin/users")}
              >
                <User className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/admin/departments")}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Manage Departments
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/admin/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Create New User
            </CardTitle>
            <CardDescription>
              Add a new user to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={department}
                  onValueChange={(value) => setDepartment(value as Department)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Prepress">Prepress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as "Admin" | "Member")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6 glass-card">
        <CardHeader>
          <CardTitle>Current Users</CardTitle>
          <CardDescription>
            All users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-accent/50">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Department</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-opacity-20">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email || "N/A"}</td>
                    <td className="p-3">{user.department}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/users")}>
                        Edit
                      </Button>
                    </td>
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

export default Admin;
