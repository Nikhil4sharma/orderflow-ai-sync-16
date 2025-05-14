
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChhapaiLogo } from '@/components/ChhapaiLogo';
import { LoaderCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 flex items-center flex-col">
        <div className="w-20 h-20 mb-4">
          <ChhapaiLogo />
        </div>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      autoComplete="username"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      autoComplete="current-password"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Demo Logins:</p>
          <p><strong>Admin:</strong> admin@example.com</p>
          <p><strong>Sales:</strong> sales@example.com</p>
          <p><strong>Design:</strong> design@example.com</p>
          <p>Password: <strong>password123</strong></p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
