type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

function FreeLedgerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <polygon points="30,220 70,220 104,40 64,40" />
      <polygon points="64,40 170,40 166.2,60 100.2,60" />
      <polygon points="89,120 149,120 144.4,144 84.4,144" />
      <polygon points="170,40 190,40 188.86,46 168.86,46" />
      <polygon points="168.67,47 200.67,47 199.53,53 167.53,53" />
      <polygon points="167.34,54 211.34,54 210.2,60 166.2,60" />
    </svg>
  );
}

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FreeLedgerMark className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />
      {showWordmark && (
        <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          FreeLedger
        </span>
      )}
    </div>
  );
}
