import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, Expense, FinancialSummary } from "@/types/project";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";
import * as api from "@/services/api";

interface ProjectContextType {
  projects: Project[];
  financialSummary: FinancialSummary;
  addProject: (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "completionPercentage"
    >,
  ) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addExpense: (
    projectId: string,
    expense: Omit<Expense, "id">,
  ) => Promise<void>;
  updateExpense: (projectId: string, expense: Expense) => Promise<void>;
  deleteExpense: (projectId: string, expenseId: string) => Promise<void>;
  updateProjectProgress: (
    projectId: string,
    completionPercentage: number,
  ) => Promise<void>;
  loading: boolean;
  refreshProjects: () => Promise<void>;
}

const initialFinancialSummary: FinancialSummary = {
  totalPortfolioValue: 0,
  pendingPayments: 0,
  projectedEarnings: 0,
  completedProjects: 0,
  activeProjects: 0,
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>(
    initialFinancialSummary,
  );
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load projects and financial summary when user is authenticated
  useEffect(() => {
    if (user) {
      refreshProjects();

      // Set up a refresh interval to keep the financial summary updated
      const intervalId = setInterval(() => {
        refreshProjects();
      }, 60000); // Refresh every minute

      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Refresh projects and financial summary
  const refreshProjects = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load projects
      const projectsData = await api.getProjects();
      setProjects(projectsData);

      // Load financial summary
      const summaryData = await api.getFinancialSummary();
      setFinancialSummary(summaryData);

      // Calculate financial summary from projects if API fails
      if (
        !summaryData ||
        Object.values(summaryData).every((val) => val === 0)
      ) {
        calculateFinancialSummary(projectsData);
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message,
        variant: "destructive",
      });
      // Calculate summary from projects if API fails
      calculateFinancialSummary(projects);
    } finally {
      setLoading(false);
    }
  };

  // Calculate financial summary from projects
  const calculateFinancialSummary = (projectsList: Project[]) => {
    const summary: FinancialSummary = {
      totalPortfolioValue: 0,
      pendingPayments: 0,
      projectedEarnings: 0,
      completedProjects: 0,
      activeProjects: 0,
    };

    projectsList.forEach((project) => {
      // Total portfolio value is the sum of all project budgets
      summary.totalPortfolioValue += project.budget;

      // Count completed and active projects
      if (project.status === "completed") {
        summary.completedProjects += 1;
      } else if (
        project.status === "pending" ||
        project.status === "in-progress"
      ) {
        summary.activeProjects += 1;

        // Calculate pending payments based on completion percentage
        const percentRemaining = 1 - project.completionPercentage / 100;
        summary.pendingPayments += project.budget * percentRemaining;

        // Calculate projected earnings for the next 30 days
        const dueDate = new Date(project.dueDate);
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        if (dueDate <= thirtyDaysFromNow) {
          summary.projectedEarnings += project.budget;
        }
      }
    });

    // Round to 2 decimal places
    summary.totalPortfolioValue =
      Math.round(summary.totalPortfolioValue * 100) / 100;
    summary.pendingPayments = Math.round(summary.pendingPayments * 100) / 100;
    summary.projectedEarnings =
      Math.round(summary.projectedEarnings * 100) / 100;

    setFinancialSummary(summary);
  };

  // Add a new project
  const addProject = async (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "completionPercentage"
    >,
  ) => {
    try {
      const newProject = await api.createProject(project);
      setProjects([...projects, newProject]);
      refreshProjects(); // Refresh to update financial summary

      toast({
        title: "تم إنشاء المشروع بنجاح",
        description: `تم إنشاء مشروع ${newProject.title} بنجاح`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء المشروع",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update an existing project
  const updateProject = async (project: Project) => {
    try {
      const updatedProject = await api.updateProject(project);
      setProjects(
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
      );
      refreshProjects(); // Refresh to update financial summary

      toast({
        title: "تم تحديث المشروع بنجاح",
        description: `تم تحديث مشروع ${updatedProject.title} بنجاح`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث المشروع",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete a project
  const deleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      refreshProjects(); // Refresh to update financial summary

      toast({
        title: "تم حذف المشروع بنجاح",
        description: "تم حذف المشروع وجميع البيانات المرتبطة به",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المشروع",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add an expense to a project
  const addExpense = async (
    projectId: string,
    expense: Omit<Expense, "id">,
  ) => {
    try {
      const newExpense = await api.addExpense(projectId, expense);

      // Update the local state
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId) {
          const expenses = project.expenses || [];
          return {
            ...project,
            expenses: [...expenses, newExpense],
          };
        }
        return project;
      });

      setProjects(updatedProjects);
      refreshProjects(); // Refresh to update financial summary

      toast({
        title: "تم إضافة المصروف بنجاح",
        description: `تم إضافة مصروف ${newExpense.description} بنجاح`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إضافة المصروف",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update an expense
  const updateExpense = async (projectId: string, expense: Expense) => {
    try {
      const updatedExpense = await api.updateExpense(projectId, expense);

      // Update the local state
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId && project.expenses) {
          return {
            ...project,
            expenses: project.expenses.map((e) =>
              e.id === updatedExpense.id ? updatedExpense : e,
            ),
          };
        }
        return project;
      });

      setProjects(updatedProjects);
      refreshProjects(); // Refresh to update financial summary

      toast({
        title: "تم تحديث المصروف بنجاح",
        description: `تم تحديث مصروف ${updatedExpense.description} بنجاح`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث المصروف",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete an expense
  const deleteExpense = async (projectId: string, expenseId: string) => {
    try {
      await api.deleteExpense(projectId, expenseId);

      // Update the local state
      const updatedProjects = projects.map((project) => {
        if (project.id === projectId && project.expenses) {
          return {
            ...project,
            expenses: project.expenses.filter((e) => e.id !== expenseId),
          };
        }
        return project;
      });

      setProjects(updatedProjects);
      refreshProjects(); // Refresh to update financial summary

      toast({
        title: "تم حذف المصروف بنجاح",
        description: "تم حذف المصروف بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في حذف المصروف",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update project progress
  const updateProjectProgress = async (
    projectId: string,
    completionPercentage: number,
  ) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) throw new Error("المشروع غير موجود");

      // If completion is 100%, set status to completed
      const status =
        completionPercentage === 100 ? "completed" : project.status;

      const updatedProject = await api.updateProject({
        ...project,
        completionPercentage,
        status,
      });

      setProjects(
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
      );
      refreshProjects(); // Refresh to update financial summary

      toast({
        title: "تم تحديث تقدم المشروع بنجاح",
        description: `تم تحديث تقدم المشروع إلى ${completionPercentage}%`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تحديث تقدم المشروع",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
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
        loading,
        refreshProjects,
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

// Export statement removed as functions are now directly exported
