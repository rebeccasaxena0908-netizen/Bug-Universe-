import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import BugList from "./pages/BugList.tsx";
import BugDetail from "./pages/BugDetail.tsx";
import CodeReview from "./pages/CodeReview.tsx";
import Login from "./pages/Login.tsx";
import NewBug from "./pages/NewBug.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Index />} />
          <Route path="/bugs"    element={<BugList />} />
          <Route path="/bugs/new" element={<NewBug />} />
          <Route path="/bugs/:id" element={<BugDetail />} />
          <Route path="/review"  element={<CodeReview />} />
          <Route path="/login"   element={<Login />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;