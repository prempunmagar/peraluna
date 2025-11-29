// Simple Crescent Moon Icon Component
function CrescentMoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PeralunaLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CrescentMoonIcon className="h-10 w-10 text-foreground" />
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          Peraluna
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          AI Travel Companion
        </span>
      </div>
    </div>
  );
}
