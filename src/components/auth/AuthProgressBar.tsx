/**
 * Auth Progress Bar Component
 *
 * Presentational component for step progress indicator
 * Following Single Responsibility Principle - only renders progress UI
 */

interface AuthProgressBarProps {
  currentStepIndex: number;
  showProgress: boolean;
}

const STEPS = ["Phone", "Verify", "Profile"];

export default function AuthProgressBar({
  currentStepIndex,
  showProgress,
}: AuthProgressBarProps) {
  if (!showProgress) return null;

  return (
    <div className="flex justify-between mb-10 relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
      {STEPS.map((label, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        return (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/40"
                  : "bg-gray-200 text-gray-400"
              } ${isCurrent ? "scale-110" : ""}`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                isActive ? "text-purple-600" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
