
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OrderProvider } from "@/contexts/OrderContext";
import Dashboard from "./pages/Dashboard";
import OrderDetail from "./pages/OrderDetail";
import NewOrder from "./pages/NewOrder";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import ThemeToggle from "./components/ThemeToggle";
import UserMenu from "./components/UserMenu";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Check if user is authenticated by looking at localStorage
  const isAuthenticated = localStorage.getItem('currentUser') !== null;
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="orderflow-theme">
      <OrderProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <div className="container mx-auto py-4 px-4 flex justify-between items-center">
                <div className="font-bold text-xl">OrderFlow</div>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <UserMenu />
                </div>
              </div>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/new-order" 
                  element={
                    <ProtectedRoute>
                      <NewOrder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </OrderProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
