import { lazy, Suspense } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LandingPage from "@/pages/LandingPage";

/**
 * AppShell is lazy-loaded so that heavy providers (react-query, radix
 * tooltip/toast, sonner) and all authenticated-route code stay out of
 * the landing-page critical bundle.
 */
const AppShell = lazy(() => import("@/components/AppShell"));

function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  // Fast path: unauthenticated landing page.
  // No heavy providers needed — renders instantly from the initial bundle.
  if (location.pathname === "/" && !user) {
    return <LandingPage />;
  }

  // Full app: lazy-load providers + authenticated routes
  return (
    <Suspense fallback={<PageLoader />}>
      <AppShell />
    </Suspense>
  );
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
