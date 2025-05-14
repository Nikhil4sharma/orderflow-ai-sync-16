
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/contexts/UserContext";
import { toast } from "sonner";
import { demoLogin } from "@/utils/orderWorkflow";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For development mode, use the demo login (simulated authentication)
      const result = await demoLogin(email, password);
      
      // Set the user in the context
      if (login && result.user) {
        login(result.user);
        
        // Show success toast
        toast.success(`Welcome, ${result.user.name}!`, {
          description: `You are logged in as ${result.user.role} (${result.user.department})`,
        });
        
        // Redirect based on department
        switch (result.user.department) {
          case "Sales":
            navigate("/sales");
            break;
          case "Design":
            navigate("/design");
            break;
          case "Prepress":
            navigate("/prepress");
            break;
          case "Production":
            navigate("/production");
            break;
          case "Admin":
            navigate("/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">OrderFlow</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to login
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Demo Logins:</p>
              <ul className="list-disc list-inside">
                <li>admin@example.com / password</li>
                <li>sales@example.com / password</li>
                <li>design@example.com / password</li>
                <li>prepress@example.com / password</li>
                <li>production@example.com / password</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
