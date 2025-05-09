
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";
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

// Configure query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <MusicProvider>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" closeButton richColors />
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
      </MusicProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
