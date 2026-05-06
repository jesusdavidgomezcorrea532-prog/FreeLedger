"use client";

import { useEffect } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

export type Shortcut = {
  key: string;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: ShortcutHandler;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (!shortcut.key || !event.key) continue;
        const matchesKey = shortcut.key.toLowerCase() === event.key.toLowerCase();
        if (!matchesKey) continue;

        const wantsMeta = !!shortcut.meta;
        const hasMeta = event.metaKey || event.ctrlKey;
        if (wantsMeta && !hasMeta) continue;
        if (!wantsMeta && hasMeta && shortcut.key.length === 1) continue;

        if (!!shortcut.shift !== event.shiftKey) continue;
        if (!!shortcut.alt !== event.altKey) continue;

        if (!shortcut.meta && shortcut.key.length === 1 && isEditableTarget(event.target)) {
          if (shortcut.key !== "Escape") continue;
        }

        shortcut.handler(event);
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}
