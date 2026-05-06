"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2Icon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  CLIENT_COLORS,
  COUNTRIES,
  CURRENCIES,
  DEFAULT_COUNTRY,
  MONTHS,
  getCountry,
} from "@/lib/constants";
import {
  finishOnboardingAndRedirect,
  type OnboardingPayload,
} from "@/lib/actions/onboarding";

type Step = 1 | 2 | 3;

type WizardState = {
  country: string;
  currency: string;
  taxRate: number;
  fiscalYearStart: number;
  clientName: string;
  clientEmail: string;
  clientColor: string;
  skipClient: boolean;
};

const STEP_TITLES: Record<Step, string> = {
  1: "About you",
  2: "Tax settings",
  3: "Your first client",
};

const STEP_DESCRIPTIONS: Record<Step, string> = {
  1: "Tell us where you work so we can set sensible defaults.",
  2: "Set how much you'll reserve for taxes. You can change this later.",
  3: "Add your first client to start tracking income — or skip for now.",
};

function initialState(initial: {
  country: string;
  currency: string;
  taxRate: number;
  fiscalYearStart: number;
}): WizardState {
  return {
    country: initial.country || DEFAULT_COUNTRY,
    currency: initial.currency || "USD",
    taxRate: initial.taxRate || 25,
    fiscalYearStart: initial.fiscalYearStart || 1,
    clientName: "",
    clientEmail: "",
    clientColor: CLIENT_COLORS[0],
    skipClient: false,
  };
}

type OnboardingWizardProps = {
  initial: {
    country: string;
    currency: string;
    taxRate: number;
    fiscalYearStart: number;
  };
};

export function OnboardingWizard({ initial }: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<WizardState>(initialState(initial));
  const [pending, startTransition] = useTransition();

  const stepValid = useMemo(() => {
    if (step === 1) return Boolean(state.country && state.currency);
    if (step === 2) return state.taxRate >= 0 && state.taxRate <= 50;
    if (step === 3) return state.skipClient || state.clientName.trim().length > 0;
    return false;
  }, [step, state]);

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onCountryChange = (code: string) => {
    const country = getCountry(code);
    setState((prev) => ({
      ...prev,
      country: code,
      currency: country?.currency ?? prev.currency,
      taxRate: country?.taxRate ?? prev.taxRate,
    }));
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep((s) => (s - 1) as Step);
  };

  const handleNext = () => {
    if (!stepValid || pending) return;
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
      return;
    }
    submit();
  };

  const submit = () => {
    const payload: OnboardingPayload = {
      country: state.country,
      currency: state.currency,
      taxRate: state.taxRate,
      fiscalYearStart: state.fiscalYearStart,
    };

    if (!state.skipClient && state.clientName.trim()) {
      payload.client = {
        name: state.clientName.trim(),
        email: state.clientEmail.trim() || undefined,
        color: state.clientColor,
      };
    }

    startTransition(async () => {
      const result = await finishOnboardingAndRedirect(payload);
      if (result && !result.success) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 p-6 shadow-xl shadow-black/40 sm:p-8">
      <Stepper current={step} />

      <div className="mt-6 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {STEP_TITLES[step]}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{STEP_DESCRIPTIONS[step]}</p>
      </div>

      <div
        key={step}
        className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-200"
      >
        {step === 1 && (
          <Step1 state={state} onCountryChange={onCountryChange} update={update} />
        )}
        {step === 2 && <Step2 state={state} update={update} />}
        {step === 3 && <Step3 state={state} update={update} />}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1 || pending}
          className="text-zinc-700 dark:text-zinc-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!stepValid || pending}
          className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
        >
          {pending ? (
            <>
              <Loader2Icon className="mr-1 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : step === 3 ? (
            <>
              Finish <Check className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Stepper({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => {
        const active = n === current;
        const done = n < current;
        return (
          <div
            key={n}
            className={cn(
              "flex-1 rounded-full transition-colors",
              active
                ? "h-1.5 bg-emerald-500"
                : done
                  ? "h-1.5 bg-emerald-700"
                  : "h-1.5 bg-zinc-200 dark:bg-zinc-800",
            )}
            aria-label={`Step ${n} ${active ? "current" : done ? "complete" : "upcoming"}`}
          />
        );
      })}
      <span className="ml-2 text-xs text-zinc-500">Step {current} of 3</span>
    </div>
  );
}

type StepProps = {
  state: WizardState;
  update: <K extends keyof WizardState>(key: K, value: WizardState[K]) => void;
};

function Step1({
  state,
  onCountryChange,
  update,
}: StepProps & { onCountryChange: (code: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="country" className="text-zinc-700 dark:text-zinc-300">
          Country
        </Label>
        <Select
          value={state.country}
          onValueChange={(v) => v != null && onCountryChange(v)}
        >
          <SelectTrigger id="country" className="h-9 w-full">
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
        <Label htmlFor="currency" className="text-zinc-700 dark:text-zinc-300">
          Currency
        </Label>
        <Select
          value={state.currency}
          onValueChange={(v) => v != null && update("currency", v)}
        >
          <SelectTrigger id="currency" className="h-9 w-full">
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
  );
}

function Step2({ state, update }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="taxRate" className="text-zinc-700 dark:text-zinc-300">
            Tax rate
          </Label>
          <span className="text-sm font-medium text-emerald-400">
            {state.taxRate}%
          </span>
        </div>
        <input
          id="taxRate"
          type="range"
          min={0}
          max={50}
          step={1}
          value={state.taxRate}
          onChange={(e) => update("taxRate", Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            max={50}
            value={state.taxRate}
            onChange={(e) => update("taxRate", Number(e.target.value))}
            className="h-8 w-24 border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          />
          <span className="text-xs text-zinc-500">% of income</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fiscalYearStart" className="text-zinc-700 dark:text-zinc-300">
          Fiscal year starts
        </Label>
        <Select
          value={String(state.fiscalYearStart)}
          onValueChange={(v) => v != null && update("fiscalYearStart", Number(v))}
        >
          <SelectTrigger id="fiscalYearStart" className="h-9 w-full">
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
      <p className="text-xs text-zinc-500">
        This is an estimate. You can change it anytime in Settings.
      </p>
    </div>
  );
}

function Step3({ state, update }: StepProps) {
  if (state.skipClient) {
    return (
      <div className="space-y-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40 p-4 text-sm text-zinc-600 dark:text-zinc-400">
        <p>You can add clients later from the Clients page.</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => update("skipClient", false)}
          className="text-emerald-400 hover:text-emerald-300"
        >
          Add a client now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="clientName" className="text-zinc-700 dark:text-zinc-300">
          Client name
        </Label>
        <Input
          id="clientName"
          required
          value={state.clientName}
          onChange={(e) => update("clientName", e.target.value)}
          placeholder="Acme Inc."
          className="border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="clientEmail" className="text-zinc-700 dark:text-zinc-300">
          Client email <span className="text-zinc-500">(optional)</span>
        </Label>
        <Input
          id="clientEmail"
          type="email"
          value={state.clientEmail}
          onChange={(e) => update("clientEmail", e.target.value)}
          placeholder="billing@acme.com"
          className="border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-zinc-700 dark:text-zinc-300">Color</Label>
        <div className="flex flex-wrap gap-2">
          {CLIENT_COLORS.map((color) => {
            const active = state.clientColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => update("clientColor", color)}
                aria-label={`Pick color ${color}`}
                className={cn(
                  "h-8 w-8 rounded-full ring-1 transition",
                  active
                    ? "ring-2 ring-offset-2 ring-offset-zinc-950"
                    : "ring-zinc-300 dark:ring-zinc-800 hover:ring-zinc-600",
                )}
                style={{ backgroundColor: color, ...(active ? { boxShadow: `0 0 0 2px ${color}` } : {}) }}
              />
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={() => update("skipClient", true)}
        className="text-xs text-zinc-500 underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline"
      >
        Skip for now
      </button>
    </div>
  );
}
