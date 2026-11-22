import * as React from "react";
import { cn } from "../../app/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "md";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        variant === "outline" && "border bg-transparent",
        size === "sm" && "h-8 px-3",
        size === "md" && "h-10 px-4",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };
