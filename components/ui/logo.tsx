import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Stylized H Graphic */}
      <div className={`${sizeClasses[size]} flex items-center`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left Vertical Bar (Black) */}
          <path
            d="M8 4L12 4L12 16L8 20L8 4Z"
            fill="currentColor"
            className="text-foreground"
          />

          {/* Left Vertical Bar Bottom Extension */}
          <path
            d="M8 20L12 20L12 36L8 36L8 20Z"
            fill="currentColor"
            className="text-foreground"
          />

          {/* Right Vertical Bar (Green) */}
          <path
            d="M28 4L32 4L32 20L28 16L28 4Z"
            fill="currentColor"
            className="text-primary"
          />

          {/* Right Vertical Bar Bottom Extension */}
          <path
            d="M28 16L32 20L32 36L28 36L28 16Z"
            fill="currentColor"
            className="text-primary"
          />

          {/* Connecting Bar (Green with gradient effect) */}
          <path
            d="M12 16L28 16L26 20L14 20L12 16Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>

      {/* Text */}
      <span
        className={`font-bold text-foreground ${
          size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"
        }`}
      >
        HIREWISE
      </span>
    </div>
  );
}
