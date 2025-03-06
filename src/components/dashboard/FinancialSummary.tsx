import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { FinancialSummary as FinancialSummaryType } from "@/types/project";

interface FinancialSummaryProps {
  data: FinancialSummaryType;
}

export default function FinancialSummary({
  data = {
    totalPortfolioValue: 24500,
    pendingPayments: 8750,
    projectedEarnings: 32000,
    completedProjects: 12,
    activeProjects: 5,
  },
}: Partial<FinancialSummaryProps>) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Portfolio Value
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.totalPortfolioValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Lifetime project value
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.pendingPayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Awaiting payment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Projected Earnings
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.projectedEarnings.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Next 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeProjects} Active</div>
          <p className="text-xs text-muted-foreground">
            {data.completedProjects} Completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
