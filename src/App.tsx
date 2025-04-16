
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import OutpassPage from "./pages/OutpassPage";
import OutpassRequests from "./pages/OutpassRequests";
import MenuPage from "./pages/MenuPage";
import MenuManager from "./pages/MenuManager";
import ComplaintsPage from "./pages/ComplaintsPage";
import AttendancePage from "./pages/AttendancePage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import StudentsPage from "./pages/StudentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/outpass" element={<OutpassPage />} />
              <Route path="/outpass-requests" element={<OutpassRequests />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/menu-manager" element={<MenuManager />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
