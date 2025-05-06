
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  const { isAuthenticated } = useOrders();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // Set document title
  useEffect(() => {
    document.title = "Sign In | OrderFlow Management";
    
    // Optional: add a class to the body for custom styling during login
    document.body.classList.add('login-page');
    
    // Clean up
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  // If user is already authenticated, redirect to the intended destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <LoginForm />;
};

export default Login;
