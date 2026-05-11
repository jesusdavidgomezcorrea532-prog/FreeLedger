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
import { INCOME_STATUSES, PAYMENT_METHODS } from "@/lib/constants";
import {
  createIncomeAction,
  updateIncomeAction,
} from "@/lib/actions/income";
import type { ClientRecord, IncomeWithClient } from "@/types";

type IncomeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income?: IncomeWithClient | null;
  clients: ClientRecord[];
};

const today = () => new Date().toISOString().slice(0, 10);

export function IncomeFormDialog({
  open,
  onOpenChange,
  income,
  clients,
}: IncomeFormDialogProps) {
  const isEdit = Boolean(income);
  const [amount, setAmount] = useState(
    income ? String(income.amount) : "",
  );
  const [clientId, setClientId] = useState(
    income?.client_id ?? clients[0]?.id ?? "",
  );
  const [description, setDescription] = useState(income?.description ?? "");
  const [date, setDate] = useState(income?.date ?? today());
  const [paymentMethod, setPaymentMethod] = useState(
    income?.payment_method ?? "bank_transfer",
  );
  const [status, setStatus] = useState(income?.status ?? "received");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.set("amount", amount);
    fd.set("client_id", clientId);
    fd.set("description", description);
    fd.set("date", date);
    fd.set("payment_method", paymentMethod);
    fd.set("status", status);

    startTransition(async () => {
      const result =
        isEdit && income
          ? await updateIncomeAction(income.id, fd)
          : await createIncomeAction(fd);

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
            <DialogTitle>{isEdit ? "Edit income" : "Add income"}</DialogTitle>
            <DialogDescription>
              Track money received from a client.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="income-amount">Amount</Label>
              <Input
                id="income-amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1200.00"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="income-date">Date</Label>
              <Input
                id="income-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="income-client">Client</Label>
            {clients.length === 0 ? (
              <p className="text-sm text-amber-400">
                Add a client first before recording income.
              </p>
            ) : (
              <Select
                value={clientId}
                onValueChange={(v) => v != null && setClientId(v)}
                items={Object.fromEntries(
                  clients.map((c) => [c.id, c.name]),
                )}
              >
                <SelectTrigger id="income-client" className="w-full">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="income-description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="income-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="February retainer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="income-payment">Payment method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) =>
                  v != null && setPaymentMethod(v as typeof paymentMethod)
                }
              >
                <SelectTrigger id="income-payment" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="income-status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => v != null && setStatus(v as typeof status)}
              >
                <SelectTrigger id="income-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
              disabled={pending || clients.length === 0}
              className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
            >
              {pending && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
