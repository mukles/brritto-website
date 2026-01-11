/**
 * Searchable Select Component
 *
 * Reusable dropdown with search functionality
 * Supports both fixed options list and async API search
 * Can allow custom input when allowCustom is enabled
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================================
// Types
// ============================================================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  /** Unique identifier for the input */
  id: string;
  /** Label text displayed above the input */
  label: string;
  /** Current selected value */
  value: string;
  /** Callback when value changes - receives value and optional label */
  onChange: (value: string, label?: string) => void;
  /** Fixed list of options (for non-API mode) */
  options?: SelectOption[];
  /** Async search function (for API mode) */
  onSearch?: (query: string) => Promise<SelectOption[]>;
  /** Allow adding custom values not in the list */
  allowCustom?: boolean;
  /** Minimum characters before triggering API search */
  minSearchLength?: number;
  /** Debounce delay for API calls in milliseconds */
  debounceMs?: number;
  /** Placeholder text for the trigger button */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Text shown when no results found */
  noResultsText?: string;
  /** Dropdown placement relative to the input */
  placement?: "top" | "bottom";
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Custom styles for label */
  labelClassName?: string;
  /** Custom styles for input/button */
  inputClassName?: string;
  /** Custom styles for error text */
  errorClassName?: string;
}

// ============================================================================
// Default Styles (matching existing project conventions)
// ============================================================================

const DEFAULT_STYLES = {
  label: "block text-sm font-semibold text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-white transition-all duration-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
  inputError: "border-red-400 focus:border-red-500 focus:ring-red-500/20",
  errorText: "mt-1.5 text-sm text-red-500 font-medium",
};

// ============================================================================
// Component
// ============================================================================

export default function SearchableSelect({
  id,
  label,
  value,
  onChange,
  options = [],
  onSearch,
  allowCustom = false,
  minSearchLength = 1,
  debounceMs = 300,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  noResultsText = "No results found",
  placement,
  disabled = false,
  required = false,
  error,
  labelClassName,
  inputClassName,
  errorClassName,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SelectOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [currentPlacement, setCurrentPlacement] = useState<"top" | "bottom">(
    placement || "bottom"
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use API mode if onSearch is provided
  const isApiMode = Boolean(onSearch);

  // ============================================================================
  // Dynamic Positioning
  // ============================================================================

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const bottomSpace = window.innerHeight - rect.bottom;
      const topSpace = rect.top;
      const dropdownHeight = 250; // Approximated max height

      // If explicit placement is provided, respect it.
      // Otherwise, auto-switch if no space below but enough space above.
      if (placement) {
        setCurrentPlacement(placement);
      } else {
        if (bottomSpace < dropdownHeight && topSpace > bottomSpace) {
          setCurrentPlacement("top");
        } else {
          setCurrentPlacement("bottom");
        }
      }
    }
  }, [isOpen, placement]);

  // Determine which options to display
  const displayOptions = isApiMode ? searchResults : options;

  // Get the selected option's label or use saved selectedLabel for API mode
  const selectedOption = [...options, ...searchResults].find(
    (opt) => opt.value === value
  );
  const displayValue =
    selectedOption?.label ||
    selectedLabel ||
    (allowCustom && value ? value : "");

  // Filter options based on search term (for fixed list mode)
  const filteredOptions = isApiMode
    ? searchResults
    : options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Check if search term matches any existing option
  const hasExactMatch = filteredOptions.some(
    (opt) => opt.label.toLowerCase() === searchTerm.toLowerCase()
  );

  // ============================================================================
  // API Search with Debounce
  // ============================================================================

  const performSearch = useCallback(
    async (query: string) => {
      if (!onSearch) return;

      if (query.length < minSearchLength && query.length > 0) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await onSearch(query);
        setSearchResults(results);
        setHasSearched(true);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch, minSearchLength]
  );

  // Handle search input changes with debounce
  const handleSearchChange = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);

      if (!isApiMode) return;

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced search
      debounceTimerRef.current = setTimeout(() => {
        performSearch(newSearchTerm);
      }, debounceMs);
    },
    [isApiMode, debounceMs, performSearch]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        if (isApiMode) {
          setSearchResults([]);
          setHasSearched(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isApiMode]);

  // Focus search input when dropdown opens and load initial results for API mode
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    // Load initial results when dropdown opens in API mode
    if (
      isOpen &&
      isApiMode &&
      searchResults.length === 0 &&
      !isSearching &&
      !hasSearched
    ) {
      performSearch("");
    }
  }, [isOpen, isApiMode, searchResults.length, isSearching, performSearch]);

  const handleSelect = (optionValue: string, optionLabel?: string) => {
    onChange(optionValue, optionLabel);
    if (optionLabel) setSelectedLabel(optionLabel); // Save label for display
    setIsOpen(false);
    setSearchTerm("");
    if (isApiMode) setSearchResults([]);
  };

  const handleCustomSelect = () => {
    if (searchTerm.trim()) {
      onChange(searchTerm.trim(), searchTerm.trim());
      setSelectedLabel(searchTerm.trim()); // Save custom label for display
      setIsOpen(false);
      setSearchTerm("");
      if (isApiMode) setSearchResults([]);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
        if (isApiMode) setSearchResults([]);
      }
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className={labelClassName || DEFAULT_STYLES.label}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Display Button */}
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        disabled={disabled}
        className={`${inputClassName || DEFAULT_STYLES.input} ${
          error ? DEFAULT_STYLES.inputError : ""
        } text-left flex items-center justify-between cursor-pointer`}
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute z-50 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden ${
            currentPlacement === "top" ? "bottom-full mb-1" : "mt-1"
          }`}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Loading State */}
          {isSearching && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching...
            </div>
          )}

          {/* Options List */}
          {!isSearching && (
            <ul className="max-h-44 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value, option.label)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors cursor-pointer ${
                        option.value === value
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))
              ) : searchTerm.trim() && allowCustom ? (
                <li>
                  <button
                    type="button"
                    onClick={handleCustomSelect}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors text-purple-600"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add &quot;{searchTerm.trim()}&quot;
                    </span>
                  </button>
                </li>
              ) : (
                <li className="px-4 py-3 text-sm text-gray-500 text-center">
                  {isApiMode &&
                  searchTerm.length < minSearchLength &&
                  !hasSearched
                    ? `Type ${minSearchLength}+ characters to search`
                    : noResultsText}
                </li>
              )}

              {/* Show add option even when there are filtered results */}
              {allowCustom &&
                searchTerm.trim() &&
                filteredOptions.length > 0 &&
                !hasExactMatch && (
                  <li className="border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCustomSelect}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors text-purple-600"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add &quot;{searchTerm.trim()}&quot;
                      </span>
                    </button>
                  </li>
                )}
            </ul>
          )}
        </div>
      )}

      {error && (
        <p className={errorClassName || DEFAULT_STYLES.errorText}>{error}</p>
      )}
    </div>
  );
}
