import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { FinancialSummary as FinancialSummaryType } from "@/types/project";
import { t } from "@/locales";

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
            {t("totalPortfolioValue")}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.totalPortfolioValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("lifetimeProjectValue")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("pendingPayments")}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.pendingPayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("awaitingPayment")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("projectedEarnings")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.projectedEarnings.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">{t("next30Days")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t("projectStatus")}
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.activeProjects} {t("active")}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.completedProjects} {t("completed")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
