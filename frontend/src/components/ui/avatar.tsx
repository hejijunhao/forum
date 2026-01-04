import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const initials = fallback
      ? fallback
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

    if (src) {
      return (
        <span
          ref={ref}
          className={cn(
            "relative inline-flex shrink-0 overflow-hidden rounded-full",
            sizeClasses[size],
            className
          )}
        >
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
            {...props}
          />
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-text-muted text-background font-medium",
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </span>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
