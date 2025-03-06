import { createContext, useContext, useState, ReactNode } from "react";
import { Project, Expense, FinancialSummary } from "@/types/project";

interface ProjectContextType {
  projects: Project[];
  financialSummary: FinancialSummary;
  addProject: (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "completionPercentage"
    >,
  ) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addExpense: (projectId: string, expense: Omit<Expense, "id">) => void;
  updateExpense: (projectId: string, expense: Expense) => void;
  deleteExpense: (projectId: string, expenseId: string) => void;
  updateProjectProgress: (
    projectId: string,
    completionPercentage: number,
  ) => void;
}

const initialProjects: Project[] = [
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
    expenses: [
      {
        id: "e1",
        description: "Stock footage",
        amount: 120,
        date: "2023-10-18",
        category: "Assets",
      },
      {
        id: "e2",
        description: "Voice over artist",
        amount: 250,
        date: "2023-10-22",
        category: "Contractor",
      },
    ],
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

const initialFinancialSummary: FinancialSummary = {
  totalPortfolioValue: 24500,
  pendingPayments: 8750,
  projectedEarnings: 32000,
  completedProjects: 12,
  activeProjects: 5,
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(
    initialFinancialSummary,
  );

  // Calculate financial summary based on projects
  const calculateFinancialSummary = (projectsList: Project[]) => {
    const completed = projectsList.filter(
      (p) => p.status === "completed",
    ).length;
    const active = projectsList.filter(
      (p) => p.status === "in-progress" || p.status === "pending",
    ).length;

    const totalValue = projectsList.reduce(
      (sum, project) => sum + project.budget,
      0,
    );

    const pending = projectsList
      .filter((p) => p.status !== "completed" && p.status !== "cancelled")
      .reduce((sum, project) => {
        const projectTotal = project.budget;
        const percentRemaining = 1 - project.completionPercentage / 100;
        return sum + projectTotal * percentRemaining;
      }, 0);

    const projected = projectsList
      .filter((p) => p.status !== "completed" && p.status !== "cancelled")
      .reduce((sum, project) => {
        const dueDate = new Date(project.dueDate);
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        if (dueDate <= thirtyDaysFromNow) {
          return sum + project.budget;
        }
        return sum;
      }, 0);

    setFinancialSummary({
      totalPortfolioValue: totalValue,
      pendingPayments: pending,
      projectedEarnings: projected,
      completedProjects: completed,
      activeProjects: active,
    });
  };

  // Add a new project
  const addProject = (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "completionPercentage"
    >,
  ) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: `${projects.length + 1}`,
      completionPercentage: 0,
      createdAt: now,
      updatedAt: now,
      expenses: [],
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    calculateFinancialSummary(updatedProjects);
  };

  // Update an existing project
  const updateProject = (project: Project) => {
    const updatedProjects = projects.map((p) =>
      p.id === project.id
        ? { ...project, updatedAt: new Date().toISOString() }
        : p,
    );
    setProjects(updatedProjects);
    calculateFinancialSummary(updatedProjects);
  };

  // Delete a project
  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    calculateFinancialSummary(updatedProjects);
  };

  // Add an expense to a project
  const addExpense = (projectId: string, expense: Omit<Expense, "id">) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        const expenses = project.expenses || [];
        return {
          ...project,
          expenses: [
            ...expenses,
            { ...expense, id: `e${expenses.length + 1}` },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    calculateFinancialSummary(updatedProjects);
  };

  // Update an expense
  const updateExpense = (projectId: string, expense: Expense) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId && project.expenses) {
        return {
          ...project,
          expenses: project.expenses.map((e) =>
            e.id === expense.id ? expense : e,
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    calculateFinancialSummary(updatedProjects);
  };

  // Delete an expense
  const deleteExpense = (projectId: string, expenseId: string) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId && project.expenses) {
        return {
          ...project,
          expenses: project.expenses.filter((e) => e.id !== expenseId),
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    calculateFinancialSummary(updatedProjects);
  };

  // Update project progress
  const updateProjectProgress = (
    projectId: string,
    completionPercentage: number,
  ) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        // If completion is 100%, set status to completed
        const status =
          completionPercentage === 100 ? "completed" : project.status;
        return {
          ...project,
          completionPercentage,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    calculateFinancialSummary(updatedProjects);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        financialSummary,
        addProject,
        updateProject,
        deleteProject,
        addExpense,
        updateExpense,
        deleteExpense,
        updateProjectProgress,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
