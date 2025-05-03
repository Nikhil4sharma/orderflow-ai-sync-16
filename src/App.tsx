
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "@/contexts/OrderContext";
import Dashboard from "./pages/Dashboard";
import OrderDetail from "./pages/OrderDetail";
import NewOrder from "./pages/NewOrder";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import ThemeToggle from "./components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="orderflow-theme">
      <OrderProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <div className="container mx-auto py-4 px-4 flex justify-end">
                <ThemeToggle />
              </div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/new-order" element={<NewOrder />} />
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
