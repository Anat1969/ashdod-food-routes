import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Policy from "./pages/Policy";
import ZoneCharacterization from "./pages/ZoneCharacterization";
import Directory from "./pages/Directory";
import TruckProfile from "./pages/TruckProfile";
import ApplicationForm from "./pages/ApplicationForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddTrucks from "./pages/AdminAddTrucks";
import AdminLogin from "./pages/AdminLogin";
import LocationCard from "./pages/LocationCard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Dashboard from "./pages/Dashboard";
import Advertisement from "./pages/Advertisement";
import PublicMap from "./pages/PublicMap";
import UserJourneyMap from "./pages/UserJourneyMap";
import LocalExperience from "./pages/LocalExperience";
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
              <Route path="/map" element={<PublicMap />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/zones" element={<ZoneCharacterization />} />
              <Route path="/directory" element={<ProtectedRoute adminOnly><Directory /></ProtectedRoute>} />
              <Route path="/truck/:id" element={<TruckProfile />} />
              <Route path="/apply" element={<ApplicationForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/add" element={<AdminAddTrucks />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/location-card" element={<LocationCard />} />
              <Route path="/advertisement" element={<Advertisement />} />
              <Route path="/journey" element={<UserJourneyMap />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
