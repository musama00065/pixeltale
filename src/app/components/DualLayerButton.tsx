"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface DualLayerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: "primary" | "secondary" | "dark" | "outline";
  icon?: React.ComponentType<any>;
  onClick?: () => void;
}

export default function DualLayerButton({
  children,
  variant = "primary",
  icon: Icon = ArrowRight,
  onClick,
  className = "",
  ...props
}: DualLayerButtonProps) {
  let bgClass = "";
  let textClass = "";
  let iconCircleClass = "";
  let iconColorClass = "";

  if (variant === "primary") {
    bgClass = "bg-primary hover:bg-primary-hover border border-primary";
    textClass = "text-white";
    iconCircleClass = "bg-white";
    iconColorClass = "text-primary";
  } else if (variant === "secondary") {
    bgClass = "bg-secondary hover:bg-secondary-hover border border-secondary";
    textClass = "text-white";
    iconCircleClass = "bg-white";
    iconColorClass = "text-secondary";
  } else if (variant === "dark") {
    bgClass = "bg-cozy-slate hover:bg-cozy-slate/95 border border-cozy-slate";
    textClass = "text-white";
    iconCircleClass = "bg-white";
    iconColorClass = "text-cozy-slate";
  } else {
    // outline
    bgClass = "bg-white/80 backdrop-blur border border-cozy-slate/15 hover:bg-gray-50/90";
    textClass = "text-cozy-slate";
    iconCircleClass = "bg-cozy-slate";
    iconColorClass = "text-white";
  }

  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center gap-4 pl-5.5 pr-1 py-1 rounded-[100px] font-semibold text-xs transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow ${bgClass} ${className}`}
      {...props}
    >
      {/* Dual layer text container */}
      <div className="relative h-5 overflow-hidden flex flex-col justify-start select-none">
        <div className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1/2">
          {/* Layer 1 */}
          <span className={`h-5 flex items-center justify-start ${textClass}`}>
            {children}
          </span>
          {/* Layer 2 */}
          <span className={`h-5 flex items-center justify-start ${textClass}`}>
            {children}
          </span>
        </div>
      </div>

      {/* Right-side circle with icon */}
      <div
        className={`h-[34px] w-[34px] md:h-[38px] md:w-[38px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0 ${iconCircleClass}`}
      >
        <Icon className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:translate-x-0.5 ${iconColorClass}`} />
      </div>
    </button>
  );
}
