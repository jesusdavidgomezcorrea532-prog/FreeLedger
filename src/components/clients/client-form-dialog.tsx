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
import { cn } from "@/lib/utils";
import { CLIENT_COLORS } from "@/lib/constants";
import {
  createClientAction,
  updateClientAction,
} from "@/lib/actions/clients";
import type { ClientRecord } from "@/types";

type ClientFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: ClientRecord | null;
};

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
}: ClientFormDialogProps) {
  const isEdit = Boolean(client);
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [color, setColor] = useState(client?.color ?? CLIENT_COLORS[0]);
  const [notes, setNotes] = useState(client?.notes ?? "");
  const [isActive, setIsActive] = useState(client?.is_active ?? true);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("color", color);
    fd.set("notes", notes);
    fd.set("is_active", isActive ? "true" : "false");

    startTransition(async () => {
      const result =
        isEdit && client
          ? await updateClientAction(client.id, fd)
          : await createClientAction(fd);

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
            <DialogTitle>{isEdit ? "Edit client" : "Add client"}</DialogTitle>
            <DialogDescription>
              Track work and income per client.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="client-name">Name</Label>
            <Input
              id="client-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-email">
              Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="client-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="billing@acme.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CLIENT_COLORS.map((c) => {
                const active = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={cn(
                      "h-7 w-7 rounded-full transition",
                      active
                        ? "ring-2 ring-offset-2 ring-offset-popover"
                        : "ring-1 ring-zinc-300 dark:ring-zinc-800 hover:ring-zinc-600",
                    )}
                    style={{ backgroundColor: c, ...(active ? { boxShadow: `0 0 0 2px ${c}` } : {}) }}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-notes">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id="client-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-emerald-500"
              />
              <span>Active client</span>
            </label>
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
              {isEdit ? "Save changes" : "Add client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
