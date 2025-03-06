import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NewProject = lazy(() => import("./pages/NewProject"));
const FinancesPage = lazy(() => import("./pages/FinancesPage"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="projects/new" element={<NewProject />} />
            <Route path="finances" element={<FinancesPage />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
