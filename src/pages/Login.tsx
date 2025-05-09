import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import { motion } from "framer-motion";
import ChhapaiLogo from "@/components/ChhapaiLogo";

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Brand section - visible on desktop */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/10 to-muted/20 flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9IjAuMDMiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMyIgY3k9IjMiIHI9IjMiLz48Y2lyY2xlIGN4PSIxMyIgY3k9IjEzIiByPSIzIi8+PC9nPjwvc3ZnPg==')]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="z-10 text-center"
        >
          <ChhapaiLogo size="lg" className="mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Order Management</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Streamline your printing operations with our comprehensive order management system
          </p>
          
          <div className="mt-16 grid grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-background/50 backdrop-blur shadow-sm border border-border/30">
              <div className="font-semibold text-lg mb-2">Streamlined Workflow</div>
              <p className="text-sm text-muted-foreground">Manage orders from quote to delivery in one place</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 backdrop-blur shadow-sm border border-border/30">
              <div className="font-semibold text-lg mb-2">Real-time Updates</div>
              <p className="text-sm text-muted-foreground">Stay informed with instant status notifications</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo - only shown on mobile */}
          <div className="md:hidden text-center mb-6">
            <ChhapaiLogo size="lg" className="mx-auto" />
            <p className="text-muted-foreground mt-2">Order Management System</p>
          </div>
          
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Chhapai Order Management System
          </p>
        </motion.div>
      </div>
    </div>
  );
}
