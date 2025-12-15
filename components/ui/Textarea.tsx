import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        {label}
                        {props.required && <span className="text-secondary ml-1">*</span>}
                    </label>
                )}
                <textarea
                    id={textareaId}
                    ref={ref}
                    className={cn(
                        "input w-full px-4 py-3 bg-card/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground",
                        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-200 resize-y min-h-[120px]",
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

Textarea.displayName = "Textarea";

export { Textarea };
