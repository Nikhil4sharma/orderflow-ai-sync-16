import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { User, BarChart3, FileText, LayoutGrid, Settings, Sheet } from "lucide-react";

const adminSections = [
  {
    title: "Manage Users",
    description: "Add, edit, and manage user accounts",
    icon: <User className="h-8 w-8 text-blue-500" />,
    link: "/admin/users",
    color: "bg-blue-900/80"
  },
  {
    title: "Manage Departments",
    description: "Configure department settings and roles",
    icon: <FileText className="h-8 w-8 text-purple-500" />,
    link: "/admin/departments",
    color: "bg-purple-900/80"
  },
  {
    title: "Dashboard Settings",
    description: "Configure dashboard elements for each department",
    icon: <LayoutGrid className="h-8 w-8 text-yellow-400" />,
    link: "/admin/dashboard-settings",
    color: "bg-yellow-900/80"
  },
  {
    title: "System Settings",
    description: "Update system-wide configuration",
    icon: <Settings className="h-8 w-8 text-green-500" />,
    link: "/admin/system-settings",
    color: "bg-green-900/80"
  },
  {
    title: "Reports",
    description: "View and generate system reports",
    icon: <BarChart3 className="h-8 w-8 text-indigo-500" />,
    link: "/admin/reports",
    color: "bg-indigo-900/80"
  },
  {
    title: "Google Sheet Integration",
    description: "Configure integration with Google Sheets",
    icon: <Sheet className="h-8 w-8 text-red-500" />,
    link: "/admin/google-sheet",
    color: "bg-red-900/80"
  }
];

const AdminManagement = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8 text-lg">Configure system settings and manage users</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map(section => (
          <Card
            key={section.title}
            className={`hover:shadow-xl transition-shadow cursor-pointer group ${section.color}`}
            onClick={() => navigate(section.link)}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div>{section.icon}</div>
              <div>
                <div className="text-xl font-semibold group-hover:text-primary transition-colors">{section.title}</div>
                <div className="text-muted-foreground mt-1">{section.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminManagement; 