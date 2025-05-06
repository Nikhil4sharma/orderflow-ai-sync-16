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
import ChhapaiLogo from "@/components/ChhapaiLogo";
import { Checkbox } from "@/components/ui/checkbox";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useOrders();
  const isMobile = useIsMobile();

  // Check if we should pre-fill with a demo account
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoAccount = params.get('demo');
    
    if (demoAccount === 'admin') {
      setEmail('admin@chhapai.com');
      setPassword('admin123');
    } else if (demoAccount === 'sales') {
      setEmail('sales@chhapai.com');
      setPassword('sales123');
    } else if (demoAccount === 'design') {
      setEmail('design@chhapai.com');
      setPassword('design123');
    } else if (demoAccount === 'production') {
      setEmail('production@chhapai.com');
      setPassword('production123');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        toast.error("Please enter both email and password");
        setIsLoading(false);
        return;
      }
      
      // Normalize email to lowercase for case-insensitive comparison
      const normalizedEmail = email.toLowerCase().trim();
      
      // Try to login directly with the normalized email
      try {
        await loginUser(normalizedEmail, password);
        
        // Determine the user role from email for a personalized welcome message
        let userRole = "User";
        if (normalizedEmail.includes("admin")) {
          userRole = "Administrator";
        } else if (normalizedEmail.includes("sales")) {
          userRole = "Sales Representative";
        } else if (normalizedEmail.includes("design")) {
          userRole = "Designer";
        } else if (normalizedEmail.includes("production")) {
          userRole = "Production Manager";
        }
        
        toast.success(`Welcome back, ${userRole}!`);
        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <>
      <div className="text-center mb-6">
        <ChhapaiLogo size="lg" className="mx-auto" />
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
                  placeholder="email@chhapai.com"
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
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
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
            
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground mb-2">Demo Accounts</p>
                  <div className="grid grid-cols-1 gap-y-2">
                    {[
                      { role: "Admin", email: "admin@chhapai.com", password: "admin123" },
                      { role: "Sales", email: "sales@chhapai.com", password: "sales123" },
                      { role: "Design", email: "design@chhapai.com", password: "design123" },
                      { role: "Production", email: "production@chhapai.com", password: "production123" }
                    ].map((account) => (
                      <div key={account.role} className="p-2 border border-border/30 rounded-md hover:bg-muted transition-colors">
                        <div className="font-medium text-sm mb-1">{account.role}</div>
                        <div className="flex flex-col gap-1 text-xs">
                          <code className="font-mono bg-background/80 px-1 py-0.5 rounded">{account.email}</code>
                          <code className="font-mono bg-background/80 px-1 py-0.5 rounded">{account.password}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex justify-center gap-2 flex-wrap">
                {["Admin", "Sales", "Design", "Production"].map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setEmail(`${role.toLowerCase()}@chhapai.com`);
                      setPassword(`${role.toLowerCase()}123`);
                    }}
                    className="text-xs h-8"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default LoginForm;
