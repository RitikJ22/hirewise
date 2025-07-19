import React from "react";

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
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* HIREWISE Logo Image */}
      <div className={`${sizeClasses[size]} flex items-center brightness-200 contrast-200`}>
        <img
          src="/Hirewise.png"
          alt="HIREWISE Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
