import { useState, useId } from "react";

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  isSelect?: boolean;
  name?: string;
}

export function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = "",
  options = [],
  isSelect = false,
  name,
}: FloatingInputProps) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [shake, setShake] = useState(false);

  const isFloating = isFocused || value.length > 0;

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur?.();
  };

  const showError = error && error.length > 0;

  // Trigger shake animation on error
  if (showError && !shake) {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  return (
    <div className="relative mb-6">
      <div className="relative">
        {isSelect ? (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className={`peer w-full border-b-2 bg-transparent pb-2 pt-6 text-gray-900 transition-colors focus:outline-none ${
              showError ? "border-red-500" : "border-gray-300 focus:border-[#3ea4ff]"
            } ${shake ? "animate-shake" : ""}`}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            className={`peer w-full border-b-2 bg-transparent pb-2 pt-6 text-gray-900 transition-colors focus:outline-none ${
              showError ? "border-red-500" : "border-gray-300 focus:border-[#3ea4ff]"
            } ${shake ? "animate-shake" : ""}`}
          />
        )}
        <label
          htmlFor={id}
          className={`absolute left-0 transition-all duration-200 cursor-text ${
            isFloating
              ? "-top-1 text-xs text-[#3ea4ff]"
              : "top-4 text-gray-400"
          } ${showError ? "text-red-500" : ""}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {/* Floating error message with fade-slide animation */}
      {showError && (
        <div className="mt-1 animate-fade-slide-up text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}