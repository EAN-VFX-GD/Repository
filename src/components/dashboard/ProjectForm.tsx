import { useState, useEffect } from "react";
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
import { Project } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (
    project: Omit<
      Project,
      "id" | "createdAt" | "updatedAt" | "completionPercentage"
    >,
  ) => void;
  project?: Project;
  isEditing?: boolean;
}

export default function ProjectForm({
  onSubmit,
  project,
  isEditing = false,
}: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    budget: "",
    hourlyRate: "",
    hoursWorked: "",
    status: "pending",
    category: "",
  });

  useEffect(() => {
    if (project && isEditing) {
      setFormData({
        title: project.title,
        client: project.client,
        description: project.description,
        startDate: project.startDate,
        dueDate: project.dueDate,
        budget: project.budget.toString(),
        hourlyRate: project.hourlyRate?.toString() || "",
        hoursWorked: project.hoursWorked?.toString() || "",
        status: project.status,
        category: project.category,
      });
    }
  }, [project, isEditing]);

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

    const projectData = {
      title: formData.title,
      client: formData.client,
      description: formData.description,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      budget: parseFloat(formData.budget),
      hourlyRate: formData.hourlyRate
        ? parseFloat(formData.hourlyRate)
        : undefined,
      hoursWorked: formData.hoursWorked
        ? parseFloat(formData.hoursWorked)
        : undefined,
      status: formData.status as
        | "pending"
        | "in-progress"
        | "completed"
        | "cancelled",
      category: formData.category,
      expenses: project?.expenses || [],
    };

    onSubmit(projectData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Project" : "Project Information"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your project details"
              : "Enter the details for your new project"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                name="client"
                placeholder="Enter client name"
                value={formData.client}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the project details"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
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
              <Label htmlFor="dueDate">Due Date</Label>
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
              <Label htmlFor="budget">Project Budget ($)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.hourlyRate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Hours Worked</Label>
              <Input
                id="hoursWorked"
                name="hoursWorked"
                type="number"
                step="0.5"
                placeholder="0"
                value={formData.hoursWorked}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video Editing">Video Editing</SelectItem>
                  <SelectItem value="Web Design">Web Design</SelectItem>
                  <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update" : "Create"} Project
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
