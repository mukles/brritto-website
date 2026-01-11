import React, { ReactNode } from "react";

export interface CardProps {
  icon?: ReactNode;
  iconBgColor?: string;
  title: string;
  description: string;
  className?: string;
  borderColor?: string;
}

export default function Card({
  icon,
  iconBgColor = "from-purple-600 to-pink-500",
  title,
  description,
  className = "",
  borderColor = "border-purple-100",
}: CardProps) {
  return (
    <div
      className={`
        bg-white text-center p-8 rounded-2xl
        border ${borderColor}
        shadow-lg
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-purple-500/20
        hover:-translate-y-2
        group
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {/* Icon */}
      {icon && (
        <div
          className={`
            mx-auto h-16 w-16 
            flex items-center justify-center 
            rounded-2xl 
            bg-gradient-to-br ${iconBgColor}
            text-white 
            mb-6 
            transform transition-all duration-500 ease-out
            group-hover:scale-110 group-hover:rotate-3
            shadow-lg shadow-current/30
          `
            .trim()
            .replace(/\s+/g, " ")}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-purple-600">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
