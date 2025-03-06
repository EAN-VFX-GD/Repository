import { supabase } from "@/lib/supabase";
import { Project, Expense, FinancialSummary } from "@/types/project";
import { Database } from "@/types/supabase";

// User profile
export async function getUserProfile() {
  const { data: user, error } = await supabase.auth.getUser();
  if (error) throw error;

  const { data, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.user?.id)
    .single();

  if (profileError) throw profileError;
  return data;
}

export async function updateUserProfile(updates: any) {
  const { data: user, error } = await supabase.auth.getUser();
  if (error) throw error;

  const { data, error: updateError } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.user?.id)
    .select()
    .single();

  if (updateError) throw updateError;
  return data;
}

// User settings
export async function getUserSettings() {
  const { data: user, error } = await supabase.auth.getUser();
  if (error) throw error;

  const { data, error: settingsError } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.user?.id)
    .single();

  if (settingsError) throw settingsError;
  return data;
}

export async function updateUserSettings(updates: any) {
  const { data: user, error } = await supabase.auth.getUser();
  if (error) throw error;

  const { data, error: updateError } = await supabase
    .from("user_settings")
    .update(updates)
    .eq("user_id", user.user?.id)
    .select()
    .single();

  if (updateError) throw updateError;
  return data;
}

// Projects
export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Convert from database format to frontend format
  return data.map((project) => ({
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
    completionPercentage: project.completion_percentage,
    category: project.category || "",
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  })) as Project[];
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  // Convert from database format to frontend format
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
    completionPercentage: data.completion_percentage,
    category: data.category || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Project;
}

export async function createProject(
  project: Omit<
    Project,
    "id" | "createdAt" | "updatedAt" | "completionPercentage"
  >,
) {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  // Convert from frontend format to database format
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.user?.id,
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
    })
    .select()
    .single();

  if (error) throw error;

  // Convert back to frontend format
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
    completionPercentage: data.completion_percentage,
    category: data.category || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Project;
}

export async function updateProject(project: Project) {
  // Convert from frontend format to database format
  const { data, error } = await supabase
    .from("projects")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", project.id)
    .select()
    .single();

  if (error) throw error;

  // Convert back to frontend format
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
    completionPercentage: data.completion_percentage,
    category: data.category || "",
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Expenses
export async function getProjectExpenses(projectId: string) {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: false });

  if (error) throw error;

  // Convert from database format to frontend format
  return data.map((expense) => ({
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    date: expense.date,
    category: expense.category || "",
  })) as Expense[];
}

export async function addExpense(
  projectId: string,
  expense: Omit<Expense, "id">,
) {
  // Convert from frontend format to database format
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      project_id: projectId,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
    })
    .select()
    .single();

  if (error) throw error;

  // Convert back to frontend format
  return {
    id: data.id,
    description: data.description,
    amount: data.amount,
    date: data.date,
    category: data.category || "",
  } as Expense;
}

export async function updateExpense(projectId: string, expense: Expense) {
  // Convert from frontend format to database format
  const { data, error } = await supabase
    .from("expenses")
    .update({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      updated_at: new Date().toISOString(),
    })
    .eq("id", expense.id)
    .eq("project_id", projectId)
    .select()
    .single();

  if (error) throw error;

  // Convert back to frontend format
  return {
    id: data.id,
    description: data.description,
    amount: data.amount,
    date: data.date,
    category: data.category || "",
  } as Expense;
}

export async function deleteExpense(projectId: string, expenseId: string) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("project_id", projectId);

  if (error) throw error;
  return true;
}

// Financial Summary
export async function getFinancialSummary(): Promise<FinancialSummary> {
  try {
    // Use the edge function to calculate the financial summary
    const { data, error } = await supabase.functions.invoke("project-summary");

    if (error) throw error;
    return data as FinancialSummary;
  } catch (error) {
    console.error("Error fetching financial summary:", error);

    // Return default values if there's an error
    return {
      totalPortfolioValue: 0,
      pendingPayments: 0,
      projectedEarnings: 0,
      completedProjects: 0,
      activeProjects: 0,
    };
  }
}

// Notifications
export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(id: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Storage functions for file uploads
export async function uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;
  return data;
}

export async function getFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
  return true;
}
