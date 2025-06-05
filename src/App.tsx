
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import WarLogs from "./pages/WarLogs";
import Rituals from "./pages/Rituals";
import WarCode from "./pages/WarCode";
import Success from "./pages/Success";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/success" element={<Success />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/api-test" element={<ApiTest />} />
          
          {/* Dashboard routes with sidebar layout */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/war-logs" element={<Layout><WarLogs /></Layout>} />
          <Route path="/rituals" element={<Layout><Rituals /></Layout>} />
          <Route path="/war-code" element={<Layout><WarCode /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
