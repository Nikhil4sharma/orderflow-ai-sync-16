
import React, { useState } from "react";
import { useUsers } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";
import { ThemeProvider } from "@/contexts/ThemeContext";

const Login: React.FC = () => {
  const { login, isAuthenticated } = useUsers();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(credentials.email, credentials.password);
      if (user) {
        // Redirect based on user department
        const departmentRoutes: Record<string, string> = {
          Sales: "/sales",
          Design: "/design",
          Prepress: "/prepress",
          Production: "/production",
          Admin: "/admin",
        };

        const route = departmentRoutes[user.department] || "/dashboard";
        navigate(route);
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md">
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
