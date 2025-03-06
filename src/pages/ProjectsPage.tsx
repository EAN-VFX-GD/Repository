import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectList from "@/components/dashboard/ProjectList";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const navigate = useNavigate();

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleNewProject = () => {
    navigate("/projects/new");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your active and completed projects
          </p>
        </div>
        <Button onClick={handleNewProject} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>
      <ProjectList onProjectClick={handleProjectClick} />
    </div>
  );
}
