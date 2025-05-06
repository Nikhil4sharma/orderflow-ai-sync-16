
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import LoginForm from "@/components/auth/LoginForm";
import { motion } from "framer-motion";

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
      case "Prepress":
        return "/dashboard?department=prepress";
      case "Sales":
        return "/dashboard?department=sales";
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} OrderFlow Management System
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
