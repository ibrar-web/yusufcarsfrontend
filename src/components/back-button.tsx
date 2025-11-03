import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onBack: () => void;
  label?: string;
  className?: string;
}

export function BackButton({ onBack, label = "Back", className = "" }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onBack}
      className={`gap-2 font-['Roboto'] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors ${className}`}
      style={{ fontSize: "14px" }}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
