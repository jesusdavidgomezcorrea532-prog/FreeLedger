"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  useKeyboardShortcuts,
  type Shortcut,
} from "@/lib/hooks/use-keyboard-shortcuts";

function focusSearchInput() {
  const el = document.querySelector<HTMLInputElement>("[data-search-input]");
  if (el) {
    el.focus();
    el.select();
  }
}

function clickNewButton() {
  const el = document.querySelector<HTMLButtonElement>("[data-shortcut-new]");
  if (el && !el.disabled) el.click();
}

const NEW_PATHS = ["/dashboard/income", "/dashboard/expenses", "/dashboard/clients"];

export function KeyboardShortcuts() {
  const pathname = usePathname() ?? "";
  const allowsNew = NEW_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const shortcuts = useMemo<Shortcut[]>(() => {
    const list: Shortcut[] = [
      {
        key: "k",
        meta: true,
        handler: (event) => {
          event.preventDefault();
          focusSearchInput();
        },
      },
      {
        key: "/",
        handler: (event) => {
          event.preventDefault();
          focusSearchInput();
        },
      },
    ];

    if (allowsNew) {
      list.push({
        key: "n",
        handler: (event) => {
          event.preventDefault();
          clickNewButton();
        },
      });
    }

    return list;
  }, [allowsNew]);

  useKeyboardShortcuts(shortcuts);

  return null;
}
