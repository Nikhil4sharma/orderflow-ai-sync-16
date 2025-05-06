
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrderContext";
import { LogIn, UserRound, Mail, Lock, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useOrders();
  const isMobile = useIsMobile();

  // Check if we should pre-fill with a demo account
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoAccount = params.get('demo');
    
    if (demoAccount === 'admin') {
      setEmail('admin@orderflow.com');
      setPassword('admin123');
    } else if (demoAccount === 'sales') {
      setEmail('sales@orderflow.com');
      setPassword('sales123');
    } else if (demoAccount === 'design') {
      setEmail('design@orderflow.com');
      setPassword('design123');
    } else if (demoAccount === 'production') {
      setEmail('production@orderflow.com');
      setPassword('production123');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, we'll use a simple check
      // In a real app, this would validate against stored users
      if (email === "admin@orderflow.com" && password === "admin123") {
        loginUser(email, password);
        toast.success("Welcome back, Administrator!");
        navigate("/dashboard");
      } else if (email === "sales@orderflow.com" && password === "sales123") {
        loginUser(email, password);
        toast.success("Welcome back, Sales Representative!");
        navigate("/dashboard");
      } else if (email === "design@orderflow.com" && password === "design123") {
        loginUser(email, password);
        toast.success("Welcome back, Designer!");
        navigate("/dashboard");
      } else if (email === "production@orderflow.com" && password === "production123") {
        loginUser(email, password);
        toast.success("Welcome back, Production Manager!");
        navigate("/dashboard");
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
    <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">OrderFlow</h1>
          <p className="text-muted-foreground mt-2">Order Management System</p>
        </div>
        
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <UserRound className="h-6 w-6 text-primary" />
              Sign In
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="px-0 font-normal h-auto text-xs"
                    onClick={() => toast.info("Demo accounts are listed below", {
                      description: "Choose one of the demo accounts to log in"
                    })}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me for 30 days
                </label>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Demo Accounts</p>
                    <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-x-4 gap-y-1 text-xs`}>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Admin:</span>
                        <span className="font-mono">admin@orderflow.com / admin123</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sales:</span>
                        <span className="font-mono">sales@orderflow.com / sales123</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Design:</span>
                        <span className="font-mono">design@orderflow.com / design123</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Production:</span>
                        <span className="font-mono">production@orderflow.com / production123</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setEmail("admin@orderflow.com");
                      setPassword("admin123");
                    }}
                    className="text-xs h-8"
                  >
                    Admin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setEmail("sales@orderflow.com");
                      setPassword("sales123");
                    }}
                    className="text-xs h-8"
                  >
                    Sales
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setEmail("design@orderflow.com");
                      setPassword("design123");
                    }}
                    className="text-xs h-8"
                  >
                    Design
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setEmail("production@orderflow.com");
                      setPassword("production123");
                    }}
                    className="text-xs h-8"
                  >
                    Production
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm mt-6 text-muted-foreground">
          &copy; {new Date().getFullYear()} OrderFlow Management System
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
