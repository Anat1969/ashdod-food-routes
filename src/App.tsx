import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import Policy from "./pages/Policy";
import Directory from "./pages/Directory";
import TruckProfile from "./pages/TruckProfile";
import ApplicationForm from "./pages/ApplicationForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import LocationCard from "./pages/LocationCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/truck/:id" element={<TruckProfile />} />
              <Route path="/apply" element={<ApplicationForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
