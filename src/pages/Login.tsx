
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  const { isAuthenticated, currentUser } = useOrders();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // Determine where to redirect based on department
  const getRedirectPath = () => {
    if (!currentUser) return "/dashboard";
    
    // Redirect to appropriate department view based on user role/department
    switch(currentUser.department) {
      case "Production":
        return "/dashboard?department=production";
      case "Design":
        return "/dashboard?department=design";
      case "Shipping":
        return "/dashboard?department=shipping";
      case "Finance":
        return "/dashboard?department=finance";
      case "Admin":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  // Set document title
  useEffect(() => {
    document.title = "Sign In | OrderFlow Management";
    
    // Add a class to the body for custom styling during login
    document.body.classList.add('login-page');
    
    // Clean up
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  // If user is already authenticated, redirect to the department-specific destination
  if (isAuthenticated) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-primary">OrderFlow</h1>
          <p className="text-muted-foreground">Sign in to manage orders</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
