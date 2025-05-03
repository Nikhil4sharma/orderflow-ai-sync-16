
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
import { toast } from "sonner";
import { ArrowLeft, FolderPlus, PenLine, Trash } from "lucide-react";
import { Department } from "@/types";

// Define a department type for the form
interface DepartmentData {
  id: string;
  name: Department;
  description: string;
  employees: number;
}

const ManageDepartments: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, users } = useOrders();
  
  // Preconfigured departments with descriptions
  const [departments, setDepartments] = useState<DepartmentData[]>([
    {
      id: "dept-1",
      name: "Sales",
      description: "Customer interactions and order submissions",
      employees: users.filter(u => u.department === "Sales").length
    },
    {
      id: "dept-2",
      name: "Production",
      description: "Manufacturing and assembly processes",
      employees: users.filter(u => u.department === "Production").length
    },
    {
      id: "dept-3",
      name: "Design",
      description: "Creative design and artwork preparation",
      employees: users.filter(u => u.department === "Design").length
    },
    {
      id: "dept-4",
      name: "Prepress",
      description: "File preparation for production",
      employees: users.filter(u => u.department === "Prepress").length
    }
  ]);
  
  // New department form state
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  
  // Check if current user is admin
  if (currentUser.role !== "Admin") {
    toast.error("Access denied. Admin privileges required.");
    navigate("/");
    return null;
  }

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!departmentName || !departmentDescription) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Check if department already exists
    const departmentExists = departments.some(dept => dept.name === departmentName);
    if (departmentExists) {
      toast.error("Department already exists");
      return;
    }
    
    // Create new department
    const newDepartment: DepartmentData = {
      id: `dept-${Date.now()}`,
      name: departmentName as Department,
      description: departmentDescription,
      employees: 0
    };
    
    // Add department
    setDepartments([...departments, newDepartment]);
    
    // Reset form
    setDepartmentName("");
    setDepartmentDescription("");
    
    toast.success("Department created successfully");
  };

  const handleDeleteDepartment = (id: string) => {
    // Check if users are in this department
    const dept = departments.find(d => d.id === id);
    if (dept && dept.employees > 0) {
      toast.error(`Cannot delete department with ${dept.employees} employees`);
      return;
    }
    
    // Remove the department
    setDepartments(departments.filter(dept => dept.id !== id));
    toast.success("Department deleted successfully");
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
            <FolderPlus className="h-5 w-5 mr-2" />
            Manage Departments
          </CardTitle>
          <CardDescription>
            Create and manage organizational departments
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderPlus className="h-5 w-5 mr-2" />
                Add New Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    placeholder="Marketing"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Department description"
                    value={departmentDescription}
                    onChange={(e) => setDepartmentDescription(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Department
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Department List</CardTitle>
              <CardDescription>
                All departments in the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-accent/50">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-center">Employees</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id} className="border-b border-opacity-20">
                        <td className="p-3 font-medium">{dept.name}</td>
                        <td className="p-3">{dept.description}</td>
                        <td className="p-3 text-center">{dept.employees}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDepartment(dept.id)}
                              disabled={dept.employees > 0}
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;
