import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectList from "@/components/dashboard/ProjectList";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/context/ProjectContext";
import { t } from "@/locales";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects } = useProjects();

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleNewProject = () => {
    navigate("/projects/new");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("projectsTitle")}
          </h1>
          <p className="text-muted-foreground">{t("projectsSubtitle")}</p>
        </div>
        <Button onClick={handleNewProject} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>{t("newProject")}</span>
        </Button>
      </div>
      <ProjectList projects={projects} onProjectClick={handleProjectClick} />
    </div>
  );
}
