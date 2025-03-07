import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface FinancialSummary {
  totalPortfolioValue: number;
  pendingPayments: number;
  projectedEarnings: number;
  completedProjects: number;
  activeProjects: number;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the user from the request
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get all projects for the user
    const { data: projects, error: projectsError } = await supabaseClient
      .from("projects")
      .select("*")
      .eq("user_id", user.id);

    if (projectsError) {
      return new Response(JSON.stringify({ error: projectsError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get all expenses for the user's projects
    const projectIds = projects.map((project) => project.id);
    const { data: expenses, error: expensesError } =
      projectIds.length > 0
        ? await supabaseClient
            .from("expenses")
            .select("*")
            .in("project_id", projectIds)
        : { data: [], error: null };

    if (expensesError) {
      return new Response(JSON.stringify({ error: expensesError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Calculate financial summary
    const summary: FinancialSummary = {
      totalPortfolioValue: 0,
      pendingPayments: 0,
      projectedEarnings: 0,
      completedProjects: 0,
      activeProjects: 0,
    };

    // Process projects
    for (const project of projects) {
      // Total portfolio value is the sum of all project budgets
      summary.totalPortfolioValue += parseFloat(project.budget);

      // Count completed and active projects
      if (project.status === "completed") {
        summary.completedProjects += 1;
      } else if (
        project.status === "pending" ||
        project.status === "in-progress"
      ) {
        summary.activeProjects += 1;

        // Calculate pending payments based on completion percentage
        const percentRemaining = 1 - project.completion_percentage / 100;
        summary.pendingPayments +=
          parseFloat(project.budget) * percentRemaining;

        // Calculate projected earnings for the next 30 days
        const dueDate = new Date(project.due_date);
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        if (dueDate <= thirtyDaysFromNow) {
          summary.projectedEarnings += parseFloat(project.budget);
        }
      }
    }

    // Round to 2 decimal places
    summary.totalPortfolioValue =
      Math.round(summary.totalPortfolioValue * 100) / 100;
    summary.pendingPayments = Math.round(summary.pendingPayments * 100) / 100;
    summary.projectedEarnings =
      Math.round(summary.projectedEarnings * 100) / 100;

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
