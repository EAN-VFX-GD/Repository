import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useProjects } from "@/context/ProjectContext";
import { t } from "@/locales";

export default function NewProject() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    budget: "",
    hourlyRate: "",
    category: "",
    status: "pending",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add the project to the context
    addProject({
      title: formData.title,
      client: formData.client,
      description: formData.description,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      budget: parseFloat(formData.budget),
      hourlyRate: formData.hourlyRate
        ? parseFloat(formData.hourlyRate)
        : undefined,
      status: formData.status as
        | "pending"
        | "in-progress"
        | "completed"
        | "cancelled",
      category: formData.category,
    });
    navigate("/projects");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("newProjectTitle")}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{t("projectInformation")}</CardTitle>
            <CardDescription>{t("enterProjectDetails")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("projectTitle")}</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t("enterProjectTitle")}
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">{t("clientName")}</Label>
                <Input
                  id="client"
                  name="client"
                  placeholder={t("enterClientName")}
                  value={formData.client}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("projectDescription")}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("describeProjectDetails")}
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t("startDate")}</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">{t("dueDate")}</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">{t("projectBudget")}</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="0.00"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">{t("hourlyRate")}</Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  placeholder="0.00"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t("category")}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t("selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تحرير الفيديو">
                      {t("videoEditing")}
                    </SelectItem>
                    <SelectItem value="تصميم الويب">
                      {t("webDesign")}
                    </SelectItem>
                    <SelectItem value="تصميم جرافيك">
                      {t("graphicDesign")}
                    </SelectItem>
                    <SelectItem value="التصوير الفوتوغرافي">
                      {t("photography")}
                    </SelectItem>
                    <SelectItem value="وسائل التواصل الاجتماعي">
                      {t("socialMedia")}
                    </SelectItem>
                    <SelectItem value="أخرى">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit">{t("createProject")}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
