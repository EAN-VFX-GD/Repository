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
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

// Mock data - would be replaced with actual data fetching
const mockProject = {
  id: "1",
  title: "Corporate Brand Video",
  client: "Acme Inc.",
  description:
    "Creating a 2-minute brand video for their website homepage. The video will showcase the company's values, products, and team culture.",
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
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch the project data based on the ID
  const project = mockProject;

  const totalExpenses =
    project.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalEarned = (project.hoursWorked || 0) * (project.hourlyRate || 0);
  const netProfit = project.budget - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <Badge className="ml-2">
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Client: {project.client}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Start Date</h3>
                  <p>{format(new Date(project.startDate), "PPP")}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Due Date</h3>
                  <p>{format(new Date(project.dueDate), "PPP")}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.completionPercentage}%</span>
                </div>
                <Progress
                  value={project.completionPercentage}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="finances">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="finances" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Budget
                      </h3>
                      <p className="text-2xl font-bold">
                        ${project.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Expenses
                      </h3>
                      <p className="text-2xl font-bold">
                        ${totalExpenses.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Hourly Rate
                      </h3>
                      <p className="text-2xl font-bold">
                        ${project.hourlyRate?.toLocaleString()}/hr
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Hours Worked
                      </h3>
                      <p className="text-2xl font-bold">
                        {project.hoursWorked} hrs
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Earned
                      </h3>
                      <p className="text-2xl font-bold">
                        ${totalEarned.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Net Profit
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
                <CardHeader>
                  <CardTitle>Expense Tracking</CardTitle>
                  <CardDescription>
                    Track all expenses related to this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.expenses && project.expenses.length > 0 ? (
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                        <div>Description</div>
                        <div>Category</div>
                        <div>Date</div>
                        <div className="text-right">Amount</div>
                      </div>
                      {project.expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="grid grid-cols-4 gap-4 p-4 border-b last:border-0"
                        >
                          <div>{expense.description}</div>
                          <div>{expense.category}</div>
                          <div>{format(new Date(expense.date), "PP")}</div>
                          <div className="text-right">
                            ${expense.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No expenses recorded yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>
                    Key milestones and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Timeline will be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Edit className="h-4 w-4" />
                Edit Project
              </Button>
              <Button
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Trash2 className="h-4 w-4" />
                Delete Project
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Category
                </h3>
                <p>{project.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created
                </h3>
                <p>{format(new Date(project.createdAt), "PPP")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </h3>
                <p>{format(new Date(project.updatedAt), "PPP")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
