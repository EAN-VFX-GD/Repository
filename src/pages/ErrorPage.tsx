import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  const [error, setError] = useState<string | null>(null);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check for common issues
    const issues = [];

    if (!import.meta.env.VITE_SUPABASE_URL) {
      issues.push("VITE_SUPABASE_URL environment variable is missing");
    }

    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      issues.push("VITE_SUPABASE_ANON_KEY environment variable is missing");
    }

    // Collect available environment variables (only public ones)
    const vars: Record<string, string> = {};
    Object.keys(import.meta.env).forEach((key) => {
      if (key.startsWith("VITE_")) {
        vars[key] = import.meta.env[key] ? "Set" : "Not set";
      }
    });
    setEnvVars(vars);

    if (issues.length > 0) {
      setError(issues.join("\n"));
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">حدث خطأ في التطبيق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            نعتذر عن هذا الخطأ. يرجى التحقق من الإعدادات أو المحاولة مرة أخرى
            لاحقًا.
          </p>

          {error && (
            <div className="bg-destructive/10 p-3 rounded-md text-sm">
              <p className="font-semibold mb-1">المشكلات المحتملة:</p>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-semibold mb-1">متغيرات البيئة:</p>
            <pre className="whitespace-pre-wrap">
              {Object.entries(envVars).map(
                ([key, value]) => `${key}: ${value}\n`,
              )}
            </pre>
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            <Button
              onClick={() => window.location.reload()}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث الصفحة
            </Button>

            <Link to="/">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                العودة للصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
