/**
 * Gender Selector Component
 *
 * Presentational component for gender selection radio buttons
 * Following Single Responsibility Principle - only renders gender options UI
 */

"use client";

interface GenderSelectorProps {
  value: "Male" | "Female" | "Other";
  onChange: (value: string) => void;
  disabled?: boolean;
}

const GENDER_OPTIONS = [
  { value: "Male", gradient: "from-blue-500 to-cyan-500" },
  { value: "Female", gradient: "from-pink-500 to-rose-500" },
  { value: "Other", gradient: "from-purple-500 to-fuchsia-500" },
] as const;

export default function GenderSelector({
  value,
  onChange,
  disabled = false,
}: GenderSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Gender <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-3 gap-3">
        {GENDER_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`relative flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              value === option.value
                ? `border-transparent bg-gradient-to-br ${option.gradient} shadow-lg shadow-purple-600/30 scale-105`
                : "border-gray-200 hover:border-purple-300 hover:shadow-md bg-white"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="gender"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span
              className={`text-sm font-semibold transition-colors ${
                value === option.value ? "text-white" : "text-gray-700"
              }`}
            >
              {option.value}
            </span>
            {value === option.value && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <div
                  className={`w-3 h-3 bg-gradient-to-br ${option.gradient} rounded-full`}
                ></div>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
