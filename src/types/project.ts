export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  startDate: string;
  dueDate: string;
  budget: number;
  hourlyRate?: number;
  hoursWorked?: number;
  expenses?: Expense[];
  status: "pending" | "in-progress" | "completed" | "cancelled";
  completionPercentage: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface FinancialSummary {
  totalPortfolioValue: number;
  pendingPayments: number;
  projectedEarnings: number;
  completedProjects: number;
  activeProjects: number;
}
