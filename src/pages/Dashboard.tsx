import FinancialSummary from "@/components/dashboard/FinancialSummary";
import ProjectList from "@/components/dashboard/ProjectList";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your projects and financial status
        </p>
      </div>
      <FinancialSummary />
      <ProjectList onProjectClick={handleProjectClick} />
    </div>
  );
}
