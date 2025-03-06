import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FinancialChart from "@/components/dashboard/FinancialChart";
import { useProjects } from "@/context/ProjectContext";
import { t } from "@/locales";

export default function AnalyticsPage() {
  const { projects } = useProjects();
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">(
    "month",
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("analyticsTitle")}
        </h1>
        <p className="text-muted-foreground">{t("analyticsSubtitle")}</p>
      </div>

      <div className="flex justify-start">
        <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectPeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{t("lastWeek")}</SelectItem>
            <SelectItem value="month">{t("lastMonth")}</SelectItem>
            <SelectItem value="quarter">{t("lastQuarter")}</SelectItem>
            <SelectItem value="year">{t("lastYear")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {t("financialOverviewTitle")}
          </TabsTrigger>
          <TabsTrigger value="income">{t("incomeByCategory")}</TabsTrigger>
          <TabsTrigger value="expenses">{t("expenseBreakdown")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("financialOverviewTitle")}</CardTitle>
              <CardDescription>
                {t("financialOverviewSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <FinancialChart
                projects={projects}
                type="overview"
                period={period}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("incomeByCategory")}</CardTitle>
              <CardDescription>{t("incomeSourcesByCategory")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <FinancialChart
                projects={projects}
                type="income"
                period={period}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("expenseCategories")}</CardTitle>
              <CardDescription>{t("expenseAnalysis")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <FinancialChart
                projects={projects}
                type="expenses"
                period={period}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
