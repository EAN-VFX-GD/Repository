import { useEffect, useRef } from "react";
import { Project } from "@/types/project";

interface FinancialChartProps {
  projects: Project[];
  type: "income" | "expenses" | "overview";
  period?: "week" | "month" | "quarter" | "year";
}

export default function FinancialChart({
  projects,
  type,
  period = "month",
}: FinancialChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Set canvas dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = 40;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = "#94a3b8";
    ctx.stroke();

    // Draw chart based on type
    if (type === "overview") {
      drawOverviewChart(ctx, projects, width, height, padding);
    } else if (type === "income") {
      drawIncomeChart(ctx, projects, width, height, padding, period);
    } else if (type === "expenses") {
      drawExpensesChart(ctx, projects, width, height, padding);
    }
  }, [projects, type, period]);

  const drawOverviewChart = (
    ctx: CanvasRenderingContext2D,
    projects: Project[],
    width: number,
    height: number,
    padding: number,
  ) => {
    // Calculate total values
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalExpenses = projects.reduce((sum, p) => {
      const expenses = p.expenses || [];
      return sum + expenses.reduce((expSum, exp) => expSum + exp.amount, 0);
    }, 0);
    const totalEarned = projects.reduce((sum, p) => {
      const earned = (p.hoursWorked || 0) * (p.hourlyRate || 0);
      return sum + earned;
    }, 0);

    // Draw bars
    const barWidth = 60;
    const maxValue = Math.max(totalBudget, totalExpenses, totalEarned);
    const scale = (height - 2 * padding) / maxValue;

    // Budget bar
    ctx.fillStyle = "#3b82f6";
    const budgetHeight = totalBudget * scale;
    ctx.fillRect(
      padding + 50,
      height - padding - budgetHeight,
      barWidth,
      budgetHeight,
    );

    // Expenses bar
    ctx.fillStyle = "#ef4444";
    const expensesHeight = totalExpenses * scale;
    ctx.fillRect(
      padding + 150,
      height - padding - expensesHeight,
      barWidth,
      expensesHeight,
    );

    // Earned bar
    ctx.fillStyle = "#22c55e";
    const earnedHeight = totalEarned * scale;
    ctx.fillRect(
      padding + 250,
      height - padding - earnedHeight,
      barWidth,
      earnedHeight,
    );

    // Labels
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Budget", padding + 50 + barWidth / 2, height - padding + 20);
    ctx.fillText(
      "Expenses",
      padding + 150 + barWidth / 2,
      height - padding + 20,
    );
    ctx.fillText("Earned", padding + 250 + barWidth / 2, height - padding + 20);

    // Values
    ctx.fillText(
      `$${totalBudget.toLocaleString()}`,
      padding + 50 + barWidth / 2,
      height - padding - budgetHeight - 10,
    );
    ctx.fillText(
      `$${totalExpenses.toLocaleString()}`,
      padding + 150 + barWidth / 2,
      height - padding - expensesHeight - 10,
    );
    ctx.fillText(
      `$${totalEarned.toLocaleString()}`,
      padding + 250 + barWidth / 2,
      height - padding - earnedHeight - 10,
    );
  };

  const drawIncomeChart = (
    ctx: CanvasRenderingContext2D,
    projects: Project[],
    width: number,
    height: number,
    padding: number,
    period: string,
  ) => {
    // Group projects by category
    const categories: Record<string, number> = {};
    projects.forEach((project) => {
      if (!categories[project.category]) {
        categories[project.category] = 0;
      }
      categories[project.category] += project.budget;
    });

    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    let startAngle = 0;
    const colors = [
      "#3b82f6",
      "#22c55e",
      "#eab308",
      "#ec4899",
      "#8b5cf6",
      "#f97316",
    ];

    // Draw pie slices
    let i = 0;
    const total = Object.values(categories).reduce(
      (sum, value) => sum + value,
      0,
    );

    // Draw legend
    let legendY = padding;
    ctx.font = "14px Arial";
    ctx.textAlign = "left";

    Object.entries(categories).forEach(([category, value], index) => {
      const colorIndex = index % colors.length;
      const sliceAngle = (2 * Math.PI * value) / total;

      // Draw pie slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[colorIndex];
      ctx.fill();

      // Draw legend item
      ctx.fillRect(width - 200, legendY, 15, 15);
      ctx.fillStyle = "#000";
      ctx.fillText(
        `${category}: $${value.toLocaleString()}`,
        width - 180,
        legendY + 12,
      );
      legendY += 25;

      startAngle += sliceAngle;
      i++;
    });

    // Draw total in center
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Total Income", centerX, centerY - 10);
    ctx.font = "bold 20px Arial";
    ctx.fillText(`$${total.toLocaleString()}`, centerX, centerY + 20);
  };

  const drawExpensesChart = (
    ctx: CanvasRenderingContext2D,
    projects: Project[],
    width: number,
    height: number,
    padding: number,
  ) => {
    // Group expenses by category
    const categories: Record<string, number> = {};

    projects.forEach((project) => {
      if (project.expenses) {
        project.expenses.forEach((expense) => {
          if (!categories[expense.category]) {
            categories[expense.category] = 0;
          }
          categories[expense.category] += expense.amount;
        });
      }
    });

    // Draw horizontal bar chart
    const barHeight = 30;
    const gap = 15;
    const maxValue = Math.max(...Object.values(categories), 1);
    const scale = (width - 2 * padding - 150) / maxValue;

    let y = padding + 50;
    const colors = [
      "#3b82f6",
      "#22c55e",
      "#eab308",
      "#ec4899",
      "#8b5cf6",
      "#f97316",
    ];

    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";

    Object.entries(categories).forEach(([category, value], index) => {
      const colorIndex = index % colors.length;

      // Draw category label
      ctx.fillText(category, padding + 140, y + barHeight / 2 + 5);

      // Draw bar
      ctx.fillStyle = colors[colorIndex];
      const barWidth = value * scale;
      ctx.fillRect(padding + 150, y, barWidth, barHeight);

      // Draw value
      ctx.fillStyle = "#000";
      ctx.textAlign = "left";
      ctx.fillText(
        `$${value.toLocaleString()}`,
        padding + 150 + barWidth + 10,
        y + barHeight / 2 + 5,
      );

      y += barHeight + gap;
    });

    // Draw title
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Expenses by Category", width / 2, padding / 2);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="max-w-full"
      ></canvas>
    </div>
  );
}
