import { useEffect } from "react";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import ProjectList from "@/components/dashboard/ProjectList";
import VodafoneCashBalance from "@/components/dashboard/VodafoneCashBalance";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { t } from "@/locales";

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, financialSummary, refreshProjects, loading } =
    useProjects();

  // Refresh data when component mounts
  useEffect(() => {
    refreshProjects();
  }, []);

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("dashboardTitle")}
        </h1>
        <p className="text-muted-foreground">{t("dashboardSubtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="md:col-span-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <FinancialSummary data={financialSummary} />
          )}
        </div>
        <div className="md:col-span-1">
          <VodafoneCashBalance />
        </div>
      </div>

      <ProjectList projects={projects} onProjectClick={handleProjectClick} />
    </div>
  );
}
