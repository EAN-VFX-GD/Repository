import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import FinancialChart from "@/components/dashboard/FinancialChart";
import { useProjects } from "@/context/ProjectContext";
import { t } from "@/locales";

export default function FinancesPage() {
  const { projects, financialSummary } = useProjects();

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("financesTitle")}
        </h1>
        <p className="text-muted-foreground">{t("financesSubtitle")}</p>
      </div>

      <FinancialSummary data={financialSummary} />

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="income">{t("income")}</TabsTrigger>
          <TabsTrigger value="expenses">{t("expenses")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("financialOverview")}</CardTitle>
              <CardDescription>{t("financialSummaryPeriod")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <FinancialChart projects={projects} type="overview" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("incomeBreakdown")}</CardTitle>
              <CardDescription>{t("incomeSourcesProjections")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <FinancialChart projects={projects} type="income" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("expenseTracking")}</CardTitle>
              <CardDescription>
                {t("expenseCategoriesSpending")}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <FinancialChart projects={projects} type="expenses" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
