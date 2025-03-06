import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { useProjects } from "@/context/ProjectContext";
import { useState } from "react";
import ExpenseForm from "@/components/dashboard/ExpenseForm";
import DeleteConfirmation from "@/components/dashboard/DeleteConfirmation";
import ProjectTimeline from "@/components/dashboard/ProjectTimeline";
import ProgressUpdate from "@/components/dashboard/ProgressUpdate";
import ProjectEditForm from "@/components/dashboard/ProjectEditForm";
import { t } from "@/locales";

const statusTranslations = {
  pending: "قيد الانتظار",
  "in-progress": "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    projects,
    updateProject,
    updateProjectProgress,
    addExpense,
    deleteProject,
  } = useProjects();

  // Find the project by ID
  const project = projects.find((p) => p.id === id) || projects[0];

  // State for dialogs
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const totalExpenses =
    project.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalEarned = (project.hoursWorked || 0) * (project.hourlyRate || 0);
  const netProfit = project.budget - totalExpenses;

  const handleAddExpense = (expense: Omit<any, "id">) => {
    addExpense(project.id, expense);
  };

  const handleUpdateProgress = (progress: number) => {
    updateProjectProgress(project.id, progress);
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate("/projects");
  };

  const handleEditProject = () => {
    setEditDialogOpen(true);
  };

  const handleUpdateProject = (updatedProject: any) => {
    updateProject(updatedProject);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <Badge className="mr-2">{statusTranslations[project.status]}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("projectDetails")}</CardTitle>
              <CardDescription>
                {t("client")}: {project.client}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t("description")}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">{t("startDate")}</h3>
                  <p>{format(new Date(project.startDate), "PPP")}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t("dueDate")}</h3>
                  <p>{format(new Date(project.dueDate), "PPP")}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t("progress")}</span>
                  <span>{project.completionPercentage}%</span>
                </div>
                <Progress
                  value={project.completionPercentage}
                  className="h-2"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProgressDialogOpen(true)}
                  >
                    {t("updateProgress")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="finances">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="finances">{t("finances")}</TabsTrigger>
              <TabsTrigger value="expenses">{t("expenses")}</TabsTrigger>
              <TabsTrigger value="timeline">{t("projectTimeline")}</TabsTrigger>
            </TabsList>
            <TabsContent value="finances" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("financialSummary")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t("budget")}
                      </h3>
                      <p className="text-2xl font-bold">
                        ${project.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t("totalExpenses")}
                      </h3>
                      <p className="text-2xl font-bold">
                        ${totalExpenses.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t("hourlyRate")}
                      </h3>
                      <p className="text-2xl font-bold">
                        ${project.hourlyRate?.toLocaleString()}/hr
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t("hoursWorked")}
                      </h3>
                      <p className="text-2xl font-bold">
                        {project.hoursWorked} hrs
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t("totalEarned")}
                      </h3>
                      <p className="text-2xl font-bold">
                        ${totalEarned.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t("netProfit")}
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        ${netProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expenses" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t("expenseTracking")}</CardTitle>
                    <CardDescription>{t("expenseTracking")}</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setExpenseDialogOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    {t("addExpense")}
                  </Button>
                </CardHeader>
                <CardContent>
                  {project.expenses && project.expenses.length > 0 ? (
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                        <div>{t("description")}</div>
                        <div>{t("category")}</div>
                        <div>{t("date")}</div>
                        <div className="text-left">{t("amount")}</div>
                      </div>
                      {project.expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="grid grid-cols-4 gap-4 p-4 border-b last:border-0"
                        >
                          <div>{expense.description}</div>
                          <div>{expense.category}</div>
                          <div>{format(new Date(expense.date), "PP")}</div>
                          <div className="text-left">
                            ${expense.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      {t("noExpensesRecorded")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("projectTimeline")}</CardTitle>
                  <CardDescription>{t("keyMilestones")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ProjectTimeline project={project} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full flex items-center gap-2"
                variant="outline"
                onClick={handleEditProject}
              >
                <Edit className="h-4 w-4" />
                {t("editProject")}
              </Button>
              <Button
                className="w-full flex items-center gap-2"
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                {t("deleteProject")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("projectStats")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("category")}
                </h3>
                <p>{project.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("created")}
                </h3>
                <p>{format(new Date(project.createdAt), "PPP")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("lastUpdated")}
                </h3>
                <p>{format(new Date(project.updatedAt), "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <ExpenseForm
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
        onSubmit={handleAddExpense}
      />

      <ProgressUpdate
        open={progressDialogOpen}
        onOpenChange={setProgressDialogOpen}
        currentProgress={project.completionPercentage}
        onSubmit={handleUpdateProgress}
      />

      <DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteProject}
        title={t("deleteProject")}
        description={`هل أنت متأكد من رغبتك في حذف مشروع "${project.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
      />

      <ProjectEditForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        project={project}
        onSubmit={handleUpdateProject}
      />
    </div>
  );
}
