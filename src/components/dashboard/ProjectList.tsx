import { useState } from "react";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Corporate Brand Video",
    client: "Acme Inc.",
    description: "Creating a 2-minute brand video for their website homepage",
    startDate: "2023-10-15",
    dueDate: "2023-11-30",
    budget: 3500,
    hourlyRate: 75,
    hoursWorked: 25,
    status: "in-progress",
    completionPercentage: 65,
    category: "Video Editing",
    createdAt: "2023-10-10",
    updatedAt: "2023-10-25",
  },
  {
    id: "2",
    title: "Website Redesign",
    client: "TechStart",
    description: "Complete redesign of company website with new branding",
    startDate: "2023-09-01",
    dueDate: "2023-12-15",
    budget: 5800,
    hourlyRate: 85,
    hoursWorked: 40,
    status: "in-progress",
    completionPercentage: 35,
    category: "Web Design",
    createdAt: "2023-08-25",
    updatedAt: "2023-10-20",
  },
  {
    id: "3",
    title: "Product Photography",
    client: "StyleCo",
    description: "Product photography for new clothing line",
    startDate: "2023-10-01",
    dueDate: "2023-10-15",
    budget: 1200,
    hourlyRate: 60,
    hoursWorked: 20,
    status: "completed",
    completionPercentage: 100,
    category: "Photography",
    createdAt: "2023-09-28",
    updatedAt: "2023-10-16",
  },
  {
    id: "4",
    title: "Social Media Campaign",
    client: "FreshFoods",
    description: "Design assets for Instagram and Facebook campaign",
    startDate: "2023-11-01",
    dueDate: "2023-12-01",
    budget: 2400,
    hourlyRate: 65,
    hoursWorked: 10,
    status: "pending",
    completionPercentage: 15,
    category: "Social Media",
    createdAt: "2023-10-25",
    updatedAt: "2023-10-28",
  },
];

export default function ProjectList({
  projects = mockProjects,
  onProjectClick,
}: Partial<ProjectListProps>) {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sort === "budget-high") {
      return b.budget - a.budget;
    } else if (sort === "budget-low") {
      return a.budget - b.budget;
    } else if (sort === "deadline") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const handleProjectClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="budget-high">Budget: High to Low</SelectItem>
              <SelectItem value="budget-low">Budget: Low to High</SelectItem>
              <SelectItem value="deadline">Upcoming Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </div>
      {sortedProjects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No projects found matching your filters
          </p>
          <Button onClick={() => setFilter("all")}>View All Projects</Button>
        </div>
      )}
    </div>
  );
}
