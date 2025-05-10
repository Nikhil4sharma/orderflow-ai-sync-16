
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUsers } from "@/contexts/UserContext";
import { LogIn, UserRound, Mail, Lock, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ChhapaiLogo from "@/components/ChhapaiLogo";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DemoAccount {
  role: string;
  email: string;
  password: string;
}

const demoAccounts: DemoAccount[] = [
  { role: "Admin", email: "admin@chhapai.com", password: "admin123" },
  { role: "Sales", email: "sales@chhapai.com", password: "sales123" },
  { role: "Design", email: "design@chhapai.com", password: "design123" },
  { role: "Production", email: "production@chhapai.com", password: "production123" },
];

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useUsers();
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
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <Card className="border-border/40 shadow-lg animate-fade-in hover:shadow-xl transition-all" id="login-form" data-testid="login-form">
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
          <UserRound className="h-6 w-6 text-primary" />
          Sign In
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 px-6" id="login-form-element" data-testid="login-form-element">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="email-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="password-input"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            data-testid="remember-me-checkbox"
          />
          <Label htmlFor="remember">Remember me</Label>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          id="login-button"
          data-testid="login-button"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="mt-4">
          <p className="text-sm text-center text-muted-foreground">Demo accounts:</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.role}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => useDemoAccount(account)}
                id={`demo-account-${account.role.toLowerCase()}`}
                data-testid={`demo-account-${account.role.toLowerCase()}`}
              >
                {account.role}
              </Button>
            ))}
          </div>
        </div>
      </form>
      
      <CardFooter className="flex justify-center pt-4 pb-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Chhapai Order Management
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
