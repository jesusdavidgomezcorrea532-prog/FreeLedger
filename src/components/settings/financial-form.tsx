"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
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
import { COUNTRIES, CURRENCIES, MONTHS, getCountry } from "@/lib/constants";
import {
  updateFinancialAction,
  type UserSettingsState,
} from "@/lib/actions/settings";

const INITIAL_STATE: UserSettingsState = { success: false, error: "" };

type FinancialFormProps = {
  country: string;
  currency: string;
  taxRate: number;
  fiscalYearStart: number;
};

export function FinancialForm({
  country,
  currency,
  taxRate,
  fiscalYearStart,
}: FinancialFormProps) {
  const [state, formAction, pending] = useActionState(
    updateFinancialAction,
    INITIAL_STATE,
  );

  const [countryCode, setCountryCode] = useState(country);
  const [currencyCode, setCurrencyCode] = useState(currency);
  const [tax, setTax] = useState(taxRate);
  const [fiscal, setFiscal] = useState(fiscalYearStart);

  const onCountryChange = (code: string) => {
    setCountryCode(code);
    const c = getCountry(code);
    if (c) {
      setCurrencyCode(c.currency);
      setTax(c.taxRate);
    }
  };

  useEffect(() => {
    if (!state.timestamp) return;
    if (state.success) toast.success(state.message ?? "Saved");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="settings-country">Country</Label>
          <Select
            name="country"
            value={countryCode}
            onValueChange={(v) => v != null && onCountryChange(v)}
          >
            <SelectTrigger id="settings-country" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="settings-currency">Currency</Label>
          <Select
            name="currency"
            value={currencyCode}
            onValueChange={(v) => v != null && setCurrencyCode(v)}
          >
            <SelectTrigger id="settings-currency" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="settings-tax">Tax rate</Label>
            <span className="text-sm text-emerald-400">{tax}%</span>
          </div>
          <Input
            id="settings-tax"
            name="tax_rate"
            type="number"
            min={0}
            max={50}
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="settings-fiscal">Fiscal year starts</Label>
          <Select
            name="fiscal_year_start"
            value={String(fiscal)}
            onValueChange={(v) => v != null && setFiscal(Number(v))}
          >
            <SelectTrigger id="settings-fiscal" className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
      >
        {pending && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}
        Save financial settings
      </Button>
    </form>
  );
}
