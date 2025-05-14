
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUsers } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginForm = () => {
  const { login, isAuthenticated } = useUsers();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample login credentials for demo
  const handleDemoLogin = async (userType: string) => {
    setIsLoading(true);
    let demoEmail = '';
    
    switch (userType) {
      case 'admin':
        demoEmail = 'admin@example.com';
        break;
      case 'sales':
        demoEmail = 'sales@example.com';
        break;
      case 'design':
        demoEmail = 'design@example.com';
        break;
      default:
        demoEmail = 'admin@example.com';
    }
    
    try {
      await login(demoEmail, 'password');
      toast.success(`Logged in as ${userType} user`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to log in with demo account');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to sign in</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => handleDemoLogin('admin')} disabled={isLoading}>
            Admin
          </Button>
          <Button variant="outline" onClick={() => handleDemoLogin('sales')} disabled={isLoading}>
            Sales
          </Button>
          <Button variant="outline" onClick={() => handleDemoLogin('design')} disabled={isLoading}>
            Design
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
