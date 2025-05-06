
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart, 
  FileSpreadsheet,
  LayoutDashboard
} from "lucide-react";

const Admin = () => {
  // Define admin sections
  const adminSections = [
    {
      title: "Manage Users",
      description: "Add, edit, and manage user accounts",
      icon: <Users className="h-6 w-6" />,
      path: "/admin/users",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Manage Departments",
      description: "Configure department settings and roles",
      icon: <FileText className="h-6 w-6" />,
      path: "/admin/departments",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Dashboard Settings",
      description: "Configure dashboard elements for each department",
      icon: <LayoutDashboard className="h-6 w-6" />,
      path: "/admin/dashboard-settings",
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      title: "System Settings",
      description: "Update system-wide configuration",
      icon: <Settings className="h-6 w-6" />,
      path: "/admin/settings",
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Reports",
      description: "View and generate system reports",
      icon: <BarChart className="h-6 w-6" />,
      path: "/admin/reports",
      color: "bg-indigo-500/10 text-indigo-500"
    },
    {
      title: "Google Sheet Integration",
      description: "Configure integration with Google Sheets",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      path: "/admin/google-sheet",
      color: "bg-red-500/10 text-red-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Configure system settings and manage users
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link
            to={section.path}
            key={section.title}
            className="block"
          >
            <Card className="hover:bg-accent hover:-translate-y-1 transition-all duration-200 h-full p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${section.color}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  <CardDescription className="mt-1">
                    {section.description}
                  </CardDescription>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Admin;
