"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[
          "h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors",
          "bg-white dark:bg-zinc-900",
          "text-zinc-900 dark:text-zinc-50",
          "placeholder:text-zinc-400 dark:placeholder:text-zinc-600",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  ),
);

Input.displayName = "Input";
