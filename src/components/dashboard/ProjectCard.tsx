import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { t } from "@/locales";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const statusColors = {
  pending: "bg-yellow-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const statusTranslations = {
  pending: "قيد الانتظار",
  "in-progress": "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const dueDate = new Date(project.dueDate);
  const timeRemaining = formatDistanceToNow(dueDate, { addSuffix: true });

  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground">{project.client}</p>
          </div>
          <Badge
            variant={project.status === "completed" ? "default" : "outline"}
          >
            {statusTranslations[project.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{t("progress")}</span>
              <span>{project.completionPercentage}%</span>
            </div>
            <Progress value={project.completionPercentage} className="h-2" />
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("budget")}</p>
              <p className="font-medium">${project.budget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t("due")}</p>
              <p className="font-medium">{timeRemaining}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full">
          <div className="flex items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full ${statusColors[project.status]}`}
            ></div>
            <span className="text-xs text-muted-foreground">
              {project.category}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
