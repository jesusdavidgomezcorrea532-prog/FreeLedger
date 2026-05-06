"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ChartTheme = {
  grid: string;
  axis: string;
  tick: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  tooltipLabel: string;
  cursor: string;
  legend: string;
  ringStroke: string;
};

const DARK: ChartTheme = {
  grid: "#27272a",
  axis: "#52525b",
  tick: "#a1a1aa",
  tooltipBg: "#18181b",
  tooltipBorder: "#3f3f46",
  tooltipText: "#e4e4e7",
  tooltipLabel: "#a1a1aa",
  cursor: "#3f3f46",
  legend: "#a1a1aa",
  ringStroke: "#09090b",
};

const LIGHT: ChartTheme = {
  grid: "#e4e4e7",
  axis: "#a1a1aa",
  tick: "#52525b",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e4e4e7",
  tooltipText: "#18181b",
  tooltipLabel: "#52525b",
  cursor: "#d4d4d8",
  legend: "#52525b",
  ringStroke: "#ffffff",
};

export function useChartTheme(): ChartTheme {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return DARK;
  return resolvedTheme === "light" ? LIGHT : DARK;
}
