import { Input } from "./ui/input";
import { cn } from "./ui/utils";

interface NumberPlateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onLookup?: (plate: string) => void;
}

export function NumberPlateInput({ className, onLookup, ...props }: NumberPlateInputProps) {
  return (
    <Input
      type="text"
      placeholder="e.g. AB12 CDE"
      maxLength={8}
      className={cn(
        "uppercase tracking-wider font-mono text-center h-14 border-2",
        className
      )}
      {...props}
      onChange={(e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        e.target.value = value;
        props.onChange?.(e);
      }}
    />
  );
}