import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DiscoverPage = lazy(() => import("@/pages/DiscoverPage"));
const MyActivityPage = lazy(() => import("@/pages/MyActivityPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * AppShell: Lazy-loaded wrapper for authenticated routes.
 * Contains all heavy providers (QueryClient, Tooltip, Toaster, Sonner)
 * that are NOT needed on the landing page. By lazy-loading this, we keep
 * the initial bundle ~30-40KB lighter for first-time visitors.
 */
export default function AppShell() {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/discover" replace />} />
            <Route path="/login" element={user ? <Navigate to="/discover" replace /> : <LoginPage />} />
            <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
            <Route path="/my-activity" element={<ProtectedRoute><MyActivityPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
