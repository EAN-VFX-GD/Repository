import { supabase } from "@/lib/supabase";
import { Project, Expense, FinancialSummary } from "@/types/project";
import { v4 as uuidv4 } from "uuid";

// Projects
export async function getProjects(): Promise<Project[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("projects")
      .select("*, expenses(*)")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to match our Project type
    return (data || []).map((project) => ({
      id: project.id,
      title: project.title,
      client: project.client,
      description: project.description || "",
      startDate: project.start_date,
      dueDate: project.due_date,
      budget: project.budget,
      hourlyRate: project.hourly_rate,
      hoursWorked: project.hours_worked,
      status: project.status,
      completionPercentage: project.completion_percentage || 0,
      category: project.category || "",
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      expenses: project.expenses
        ? project.expenses.map((expense: any) => ({
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category || "",
          }))
        : [],
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function createProject(
  project: Omit<
    Project,
    "id" | "createdAt" | "updatedAt" | "completionPercentage"
  >,
): Promise<Project> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("User not authenticated");

    const now = new Date().toISOString();
    const newProject = {
      id: uuidv4(),
      user_id: user.user.id,
      title: project.title,
      client: project.client,
      description: project.description,
      start_date: project.startDate,
      due_date: project.dueDate,
      budget: project.budget,
      hourly_rate: project.hourlyRate,
      hours_worked: project.hoursWorked,
      status: project.status,
      completion_percentage: 0,
      category: project.category,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(newProject)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to create project");

    // Return the project in our format
    return {
      id: data.id,
      title: data.title,
      client: data.client,
      description: data.description || "",
      startDate: data.start_date,
      dueDate: data.due_date,
      budget: data.budget,
      hourlyRate: data.hourly_rate,
      hoursWorked: data.hours_worked,
      status: data.status,
      completionPercentage: data.completion_percentage || 0,
      category: data.category || "",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expenses: [],
    };
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(project: Project): Promise<Project> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("User not authenticated");

    const now = new Date().toISOString();
    const updatedProject = {
      title: project.title,
      client: project.client,
      description: project.description,
      start_date: project.startDate,
      due_date: project.dueDate,
      budget: project.budget,
      hourly_rate: project.hourlyRate,
      hours_worked: project.hoursWorked,
      status: project.status,
      completion_percentage: project.completionPercentage,
      category: project.category,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("projects")
      .update(updatedProject)
      .eq("id", project.id)
      .eq("user_id", user.user.id)
      .select("*, expenses(*)")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to update project");

    // Return the project in our format
    return {
      id: data.id,
      title: data.title,
      client: data.client,
      description: data.description || "",
      startDate: data.start_date,
      dueDate: data.due_date,
      budget: data.budget,
      hourlyRate: data.hourly_rate,
      hoursWorked: data.hours_worked,
      status: data.status,
      completionPercentage: data.completion_percentage || 0,
      category: data.category || "",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      expenses: data.expenses
        ? data.expenses.map((expense: any) => ({
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category || "",
          }))
        : [],
    };
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("User not authenticated");

    // Delete all expenses for the project first
    const { error: expensesError } = await supabase
      .from("expenses")
      .delete()
      .eq("project_id", id);

    if (expensesError) throw expensesError;

    // Then delete the project
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// Expenses
export async function addExpense(
  projectId: string,
  expense: Omit<Expense, "id">,
): Promise<Expense> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("User not authenticated");

    const now = new Date().toISOString();
    const newExpense = {
      id: uuidv4(),
      project_id: projectId,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert(newExpense)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to add expense");

    // Return the expense in our format
    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      category: data.category || "",
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
}

export async function updateExpense(
  projectId: string,
  expense: Expense,
): Promise<Expense> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("User not authenticated");

    const now = new Date().toISOString();
    const updatedExpense = {
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("expenses")
      .update(updatedExpense)
      .eq("id", expense.id)
      .eq("project_id", projectId)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to update expense");

    // Return the expense in our format
    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      date: data.date,
      category: data.category || "",
    };
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
}

export async function deleteExpense(
  projectId: string,
  expenseId: string,
): Promise<void> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId)
      .eq("project_id", projectId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
}

// Financial Summary
export async function getFinancialSummary(): Promise<FinancialSummary> {
  try {
    // Skip edge function and return empty data to be calculated locally
    // This is a temporary solution until the edge function CORS is fixed
    return {
      totalPortfolioValue: 0,
      pendingPayments: 0,
      projectedEarnings: 0,
      completedProjects: 0,
      activeProjects: 0,
    };

    /* Commented out until CORS is fixed
    // Use the edge function to calculate the financial summary
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-financial-summary",
    );

    if (error) throw error;

    // Verify data is valid
    if (!data || typeof data !== "object")
      throw new Error("Invalid data returned from financial summary function");

    return data as FinancialSummary;
    */
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    throw error; // Let the caller handle the error and calculate summary from projects
  }
}
