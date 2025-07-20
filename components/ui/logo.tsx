import React from "react";
import clsx from "clsx";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-10",
    md: "h-12",
    lg: "h-16",
  };

  return (
    <div className={clsx("flex items-center space-x-2", className)}>
      {/* HIREWISE Logo Image */}
      <div
        className={clsx(
          sizeClasses[size],
          "flex items-center brightness-200 contrast-200"
        )}
      >
        <img
          src="/Hirewise.png"
          alt="HIREWISE Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
