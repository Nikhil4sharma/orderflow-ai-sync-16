
import React from "react";
import { Navigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  const { isAuthenticated } = useOrders();

  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
};

export default Login;
