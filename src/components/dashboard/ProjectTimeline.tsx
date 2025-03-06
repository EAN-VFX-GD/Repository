import { useEffect, useRef } from "react";
import { Project } from "@/types/project";

interface ProjectTimelineProps {
  project: Project;
}

export default function ProjectTimeline({ project }: ProjectTimelineProps) {
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

    // Draw timeline
    drawTimeline(ctx, project, width, height, padding);
  }, [project]);

  const drawTimeline = (
    ctx: CanvasRenderingContext2D,
    project: Project,
    width: number,
    height: number,
    padding: number,
  ) => {
    const startDate = new Date(project.startDate);
    const dueDate = new Date(project.dueDate);
    const today = new Date();

    // Calculate total project duration in days
    const totalDays = Math.ceil(
      (dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysElapsed = Math.ceil(
      (Math.min(today.getTime(), dueDate.getTime()) - startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // Timeline line
    const lineY = height / 2;
    const lineStart = padding;
    const lineEnd = width - padding;
    const lineLength = lineEnd - lineStart;

    // Draw main timeline line
    ctx.beginPath();
    ctx.moveTo(lineStart, lineY);
    ctx.lineTo(lineEnd, lineY);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw progress on timeline
    const progressX =
      lineStart + lineLength * (project.completionPercentage / 100);

    ctx.beginPath();
    ctx.moveTo(lineStart, lineY);
    ctx.lineTo(progressX, lineY);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw start point
    ctx.beginPath();
    ctx.arc(lineStart, lineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();

    // Draw current progress point
    ctx.beginPath();
    ctx.arc(progressX, lineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#22c55e";
    ctx.fill();

    // Draw end point
    ctx.beginPath();
    ctx.arc(lineEnd, lineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle =
      project.completionPercentage === 100 ? "#22c55e" : "#ef4444";
    ctx.fill();

    // Draw labels
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";

    // Start date label
    ctx.fillText(formatDate(startDate), lineStart, lineY + 30);
    ctx.fillText("Start", lineStart, lineY + 50);

    // Current progress label
    ctx.fillText(`${project.completionPercentage}%`, progressX, lineY - 20);
    ctx.fillText("Progress", progressX, lineY - 40);

    // Due date label
    ctx.fillText(formatDate(dueDate), lineEnd, lineY + 30);
    ctx.fillText("Due Date", lineEnd, lineY + 50);

    // Draw today marker if within project timeframe
    if (today >= startDate && today <= dueDate) {
      const todayX = lineStart + lineLength * (daysElapsed / totalDays);

      ctx.beginPath();
      ctx.moveTo(todayX, lineY - 15);
      ctx.lineTo(todayX, lineY + 15);
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(todayX, lineY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#f97316";
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.fillText("Today", todayX, lineY - 20);
    }

    // Draw title
    ctx.fillStyle = "#000";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Project Timeline", width / 2, padding / 2);
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="max-w-full"
      ></canvas>
    </div>
  );
}
