import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "link";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading = false,
            disabled,
            asChild = false,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = "btn inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-primary text-white hover:bg-primary-light hover:shadow-lg hover:-translate-y-0.5",
            secondary: "bg-transparent border border-border text-foreground hover:border-primary hover:bg-primary/10",
            ghost: "bg-transparent text-foreground hover:bg-primary/10",
            link: "text-primary underline-offset-4 hover:underline p-0",
        };

        const sizes = {
            sm: "text-sm px-3 py-1.5 rounded-md",
            md: "text-base px-6 py-3 rounded-lg",
            lg: "text-lg px-8 py-4 rounded-xl",
        };

        // If asChild, apply classes to the child element
        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, {
                className: cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    isLoading && "cursor-wait",
                    (children as any).props?.className || "",
                    className
                ),
                ref,
                ...props,
            });
        }

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    isLoading && "cursor-wait",
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Chargement...</span>
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
