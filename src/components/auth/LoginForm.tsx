import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";
import { LogIn } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useOrders();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll use a simple check
      // In a real app, this would validate against stored users
      if (email === "admin@orderflow.com" && password === "admin123") {
        loginUser(email, password);
        toast.success("Login successful!");
        navigate("/");
      } else if (email === "sales@orderflow.com" && password === "sales123") {
        loginUser(email, password);
        toast.success("Login successful!");
        navigate("/");
      } else if (email === "design@orderflow.com" && password === "design123") {
        loginUser(email, password);
        toast.success("Login successful!");
        navigate("/");
      } else if (email === "production@orderflow.com" && password === "production123") {
        loginUser(email, password);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="max-w-md w-full glass-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Order Flow</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@orderflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="px-0 font-normal h-auto text-xs"
                  onClick={() => toast.info("Demo accounts: admin@orderflow.com/admin123, sales@orderflow.com/sales123, etc.")}
                >
                  Forgot password?
                </Button>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
        <div className="p-6 pt-0">
          <p className="text-center text-sm text-muted-foreground">
            Demo accounts:<br />
            <span className="font-mono text-xs">admin@orderflow.com / admin123</span><br />
            <span className="font-mono text-xs">sales@orderflow.com / sales123</span><br />
            <span className="font-mono text-xs">production@orderflow.com / production123</span><br />
            <span className="font-mono text-xs">design@orderflow.com / design123</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
