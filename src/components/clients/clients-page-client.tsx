"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { DeleteConfirmDialog } from "@/components/clients/delete-confirm-dialog";
import { deleteClientAction } from "@/lib/actions/clients";
import { formatDateShort } from "@/lib/dates";
import type { ClientRecord } from "@/types";

type Mode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; client: ClientRecord }
  | { kind: "delete"; client: ClientRecord };

type ClientsPageClientProps = {
  clients: ClientRecord[];
};

export function ClientsPageClient({ clients }: ClientsPageClientProps) {
  const [mode, setMode] = useState<Mode>({ kind: "closed" });
  const close = () => setMode({ kind: "closed" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Clients
          </h1>
          <p className="text-sm text-zinc-500">
            Manage who you work with and tag income against them.
          </p>
        </div>
        <Button
          type="button"
          data-shortcut-new
          onClick={() => setMode({ kind: "create" })}
          className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
        >
          <Plus className="mr-1 h-4 w-4" /> Add client
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState onAdd={() => setMode({ kind: "create" })} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {clients.map((c) => (
              <li
                key={c.id}
                className="group flex items-center gap-4 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-900/40"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {c.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {c.email ?? "No email"} · added {formatDateShort(c.created_at.slice(0, 10))}
                  </p>
                </div>
                <span
                  className={`text-xs ${c.is_active ? "text-emerald-400" : "text-zinc-500"}`}
                >
                  {c.is_active ? "Active" : "Archived"}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit client"
                    onClick={() => setMode({ kind: "edit", client: c })}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete client"
                    onClick={() => setMode({ kind: "delete", client: c })}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ClientFormDialog
        open={mode.kind === "create" || mode.kind === "edit"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        client={mode.kind === "edit" ? mode.client : null}
        key={mode.kind === "edit" ? mode.client.id : mode.kind}
      />

      <DeleteConfirmDialog
        open={mode.kind === "delete"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Delete client?"
        description={
          mode.kind === "delete"
            ? `"${mode.client.name}" will be removed. Income tagged to this client will be unlinked.`
            : ""
        }
        onConfirm={async () => {
          if (mode.kind !== "delete") return { success: false, error: "Invalid state" };
          return deleteClientAction(mode.client.id);
        }}
      />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/40 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
        <Users className="h-5 w-5 text-emerald-400" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        No clients yet
      </h2>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        Add your first client to start tracking income.
      </p>
      <Button
        type="button"
        onClick={onAdd}
        className="mt-5 bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
      >
        <Plus className="mr-1 h-4 w-4" /> Add client
      </Button>
    </div>
  );
}
