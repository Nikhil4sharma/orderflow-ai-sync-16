
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart, 
  FileSpreadsheet,
  LayoutDashboard,
  Briefcase,
  CreditCard,
  Bell,
  Package,
  FileCheck,
  UserCog,
  Trash2
} from "lucide-react";
import DeleteAllOrdersButton from "@/components/admin/DeleteAllOrdersButton";

const Admin = () => {
  // Define admin sections based on the requirements
  const adminSections = [
    {
      title: "All Orders Overview",
      description: "View and manage all orders across departments",
      icon: <FileCheck className="h-6 w-6" />,
      path: "/orders",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Manage Users",
      description: "Add, edit, and manage user accounts and roles",
      icon: <Users className="h-6 w-6" />,
      path: "/admin/users",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Manage Departments",
      description: "Configure department settings and workflows",
      icon: <Briefcase className="h-6 w-6" />,
      path: "/admin/departments",
      color: "bg-indigo-500/10 text-indigo-500"
    },
    {
      title: "Dashboard Settings",
      description: "Configure dashboard elements for each department",
      icon: <LayoutDashboard className="h-6 w-6" />,
      path: "/admin/dashboard-settings",
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      title: "Payment & Invoice Records",
      description: "Manage payment statuses and invoice records",
      icon: <CreditCard className="h-6 w-6" />,
      path: "/admin/payments",
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Reports & Analytics",
      description: "View trends, turnaround time, and payment summary reports",
      icon: <BarChart className="h-6 w-6" />,
      path: "/admin/reports",
      color: "bg-teal-500/10 text-teal-500"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings and permissions",
      icon: <Settings className="h-6 w-6" />,
      path: "/admin/settings",
      color: "bg-red-500/10 text-red-500"
    },
    {
      title: "Role & Permission Management",
      description: "Configure user roles and access permissions",
      icon: <UserCog className="h-6 w-6" />,
      path: "/admin/roles",
      color: "bg-pink-500/10 text-pink-500"
    },
    {
      title: "Notification Rules",
      description: "Configure system notifications and alerts",
      icon: <Bell className="h-6 w-6" />,
      path: "/admin/notifications",
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      title: "Google Sheet Integration",
      description: "Configure integration with Google Sheets",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      path: "/admin/google-sheet",
      color: "bg-lime-500/10 text-lime-500"
    },
    {
      title: "Inventory Management",
      description: "Manage production materials and inventory",
      icon: <Package className="h-6 w-6" />,
      path: "/admin/inventory",
      color: "bg-cyan-500/10 text-cyan-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-4">
            Complete system management and configuration
          </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <DeleteAllOrdersButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Link
            to={section.path}
            key={section.title}
            className="block transition-all duration-300"
          >
            <Card className="hover:bg-accent hover:shadow-md hover:-translate-y-1 transition-all duration-200 h-full p-6 border-l-4 border-l-transparent hover:border-l-primary">
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
