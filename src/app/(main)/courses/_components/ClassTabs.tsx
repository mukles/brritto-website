"use client";

import { Class } from "@/types/courses";

interface ClassTabsProps {
  classes: Class[];
  selectedClassId: string;
  onSelect: (classId: string) => void;
}

export default function ClassTabs({
  classes,
  selectedClassId,
  onSelect,
}: ClassTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex space-x-2 md:space-x-4 min-w-max px-2 py-2">
        {classes.map((cls) => (
          <button
            key={cls._id}
            onClick={() => onSelect(cls._id)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              selectedClassId === cls._id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-600 ring-offset-2"
                : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200"
            }`}
          >
            {cls.className}
            <span
              className={`ml-2 text-xs py-0.5 px-2 rounded-full ${
                selectedClassId === cls._id
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600"
              }`}
            >
              {cls.courseCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
