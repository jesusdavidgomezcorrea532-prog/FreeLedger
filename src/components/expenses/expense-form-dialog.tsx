"use client";

import { useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES, EXPENSE_TYPES } from "@/lib/constants";
import {
  createExpenseAction,
  updateExpenseAction,
} from "@/lib/actions/expenses";
import type { ExpenseRecord, ExpenseType } from "@/types";

type ExpenseFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: ExpenseRecord | null;
};

const today = () => new Date().toISOString().slice(0, 10);

export function ExpenseFormDialog({
  open,
  onOpenChange,
  expense,
}: ExpenseFormDialogProps) {
  const isEdit = Boolean(expense);
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [description, setDescription] = useState(expense?.description ?? "");
  const [category, setCategory] = useState(expense?.category ?? "other");
  const [type, setType] = useState<ExpenseType>(
    expense?.expense_type ?? "business",
  );
  const [deductible, setDeductible] = useState(
    expense?.deductible_pct ?? 100,
  );
  const [date, setDate] = useState(expense?.date ?? today());
  const [pending, startTransition] = useTransition();

  const handleType = (next: ExpenseType) => {
    setType(next);
    if (next === "business") setDeductible(100);
    else if (next === "personal") setDeductible(0);
    else setDeductible(50);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.set("amount", amount);
    fd.set("description", description);
    fd.set("category", category);
    fd.set("expense_type", type);
    fd.set("deductible_pct", String(deductible));
    fd.set("date", date);

    startTransition(async () => {
      const result =
        isEdit && expense
          ? await updateExpenseAction(expense.id, fd)
          : await createExpenseAction(fd);

      if (result.success) {
        toast.success(result.message ?? "Saved");
        onOpenChange(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit expense" : "Add expense"}
            </DialogTitle>
            <DialogDescription>
              Track money going out, by category and type.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="120.00"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expense-description">Description</Label>
            <Input
              id="expense-description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Figma subscription"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expense-category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => v != null && setCategory(v as typeof category)}
            >
              <SelectTrigger id="expense-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleType(t.value)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-sm transition-colors",
                    type === t.value
                      ? typeStyles[t.value].active
                      : "border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-700",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {type === "mixed" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="deductible">Deductible %</Label>
                <span className="text-sm font-medium text-amber-400">
                  {deductible}%
                </span>
              </div>
              <input
                id="deductible"
                type="range"
                min={0}
                max={100}
                step={1}
                value={deductible}
                onChange={(e) => setDeductible(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
            >
              {pending && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const typeStyles: Record<ExpenseType, { active: string }> = {
  business: {
    active:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  personal: {
    active: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  },
  mixed: {
    active: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
};
