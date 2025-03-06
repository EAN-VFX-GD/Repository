import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { FinancialSummary as FinancialSummaryType } from "@/types/project";
import { t } from "@/locales";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            {t("totalPortfolioValue")}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 -ml-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.totalPortfolioValue.toLocaleString()}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>إجمالي القيمة</span>
            <span>{t("lifetimeProjectValue")}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            {t("pendingPayments")}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 -ml-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <Clock className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.pendingPayments.toLocaleString()}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>المدفوعات</span>
            <span>{t("awaitingPayment")}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            {t("projectedEarnings")}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 -ml-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.projectedEarnings.toLocaleString()}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>الأرباح</span>
            <span>{t("next30Days")}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            {t("projectStatus")}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 -ml-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.activeProjects} {t("active")}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>المشاريع</span>
            <span>
              {data.completedProjects} {t("completed")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
