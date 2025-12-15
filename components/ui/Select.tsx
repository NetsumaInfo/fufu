import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, id, options, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        {label}
                        {props.required && <span className="text-secondary ml-1">*</span>}
                    </label>
                )}
                <select
                    id={selectId}
                    ref={ref}
                    className={cn(
                        "input w-full px-4 py-3 bg-card/50 border border-border rounded-lg text-foreground",
                        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-200 cursor-pointer",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
