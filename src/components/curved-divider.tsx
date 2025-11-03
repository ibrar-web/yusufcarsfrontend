import { cn } from "./ui/utils";

interface CurvedDividerProps {
  position: "top" | "bottom";
  color?: "white" | "light" | "dark" | "muted";
  className?: string;
}

export function CurvedDivider({ position, color = "white", className }: CurvedDividerProps) {
  const colorClasses = {
    white: "text-white",
    light: "text-[#F8F9FA]",
    dark: "text-[#0F172A]",
    muted: "text-[#F1F5F9]",
  };

  const pathData = position === "top"
    ? "M0,0 C240,100 480,100 720,50 C960,0 1200,0 1440,50 L1440,100 L0,100 Z"
    : "M0,50 C240,0 480,0 720,50 C960,100 1200,100 1440,50 L1440,0 L0,0 Z";

  return (
    <div className={cn("curve-container", className)}>
      <svg
        className={cn(
          position === "top" ? "curve-top" : "curve-bottom",
          colorClasses[color]
        )}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d={pathData} />
      </svg>
    </div>
  );
}