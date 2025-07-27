import React from "react";
import { Child } from "@/types";
import { cn } from "@/lib/utils";

interface ChildAvatarProps {
  child: Child;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

export const ChildAvatar: React.FC<ChildAvatarProps> = ({
  child,
  size = "md",
  onClick,
  isSelected = false,
  className,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl",
    md: "w-20 h-20 text-3xl",
    lg: "w-32 h-32 text-5xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "rounded-full bg-card border-4 flex items-center justify-center",
          "transition-all duration-200 ease-out group-hover:scale-110",
          "shadow-lg group-hover:shadow-xl",
          sizeClasses[size],
          isSelected
            ? "border-primary bg-primary/10 ring-4 ring-primary/30"
            : "border-border group-hover:border-primary/50"
        )}
      >
        <span className="select-none">🤖</span>
      </div>
      <div className="text-center">
        <p
          className={cn(
            "font-bold",
            size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg",
            isSelected ? "text-primary" : "text-foreground"
          )}
        >
          {child.name}
        </p>
        {size !== "sm" && <p className="text-xs text-muted-foreground">Kid</p>}
      </div>
    </div>
  );
};
