import { Wallet } from "lucide-react";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30">
        <Wallet className="h-4 w-4 text-emerald-400" />
      </div>
      {showWordmark && (
        <span className="text-base font-semibold tracking-tight text-zinc-100">
          FreeLedger
        </span>
      )}
    </div>
  );
}
