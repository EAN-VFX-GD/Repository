import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense } from "@/types/project";
import { t } from "@/locales";

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (expense: Omit<Expense, "id">) => void;
  expense?: Expense;
  isEditing?: boolean;
}

export default function ExpenseForm({
  open,
  onOpenChange,
  onSubmit,
  expense,
  isEditing = false,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<Omit<Expense, "id">>(
    expense
      ? {
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
        }
      : {
          description: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          category: "",
        },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editExpense") : t("addExpense")}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t("updateExpenseDetails") : t("addNewExpense")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">{t("expenseDescription")}</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="وصف المصروف"
                required
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">{t("expenseAmount")}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{t("expenseDate")}</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t("expenseCategory")}</Label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الأصول">{t("assets")}</SelectItem>
                  <SelectItem value="المقاول">{t("contractor")}</SelectItem>
                  <SelectItem value="البرمجيات">{t("software")}</SelectItem>
                  <SelectItem value="الأجهزة">{t("hardware")}</SelectItem>
                  <SelectItem value="السفر">{t("travel")}</SelectItem>
                  <SelectItem value="أخرى">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-start">
            <Button type="submit">
              {isEditing ? t("update") : t("addExpense")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
