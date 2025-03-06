import { Suspense, lazy, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { ProjectProvider } from "./context/ProjectContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NewProject = lazy(() => import("./pages/NewProject"));
const FinancesPage = lazy(() => import("./pages/FinancesPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const [hasError, setHasError] = useState(false);

  // Check for environment variables and other potential issues
  useEffect(() => {
    try {
      // Check if required environment variables are set
      if (
        !import.meta.env.VITE_SUPABASE_URL ||
        !import.meta.env.VITE_SUPABASE_ANON_KEY
      ) {
        console.error("Missing required environment variables");
        setHasError(true);
      }
    } catch (error) {
      console.error("Error during app initialization:", error);
      setHasError(true);
    }
  }, []);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user && window.location.pathname === "/login") {
      window.location.href = "/";
    }
  }, [user, loading]);

  // If there's an initialization error, show the error page
  if (hasError) {
    return <ErrorPage />;
  }

  return (
    <ProjectProvider>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center">
              جاري التحميل...
            </div>
          }
        >
          <>
            <Routes>
              {/* Error route */}
              <Route path="/error" element={<ErrorPage />} />

              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  </ErrorBoundary>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/new" element={<NewProject />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="finances" element={<FinancesPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Dashboard />} />
              </Route>
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Toaster />
          </>
        </Suspense>
      </ErrorBoundary>
    </ProjectProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
