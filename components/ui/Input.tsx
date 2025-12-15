import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        {label}
                        {props.required && <span className="text-secondary ml-1">*</span>}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        "input w-full px-4 py-3 bg-card/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground",
                        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
