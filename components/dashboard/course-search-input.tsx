import type { ChangeEventHandler } from "react";

type CourseSearchInputProps = {
  label?: string;
  placeholder: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export function CourseSearchInput({
  label = "Search courses",
  placeholder,
  name,
  value,
  defaultValue,
  onChange,
}: CourseSearchInputProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = onChange
    ? (event) => onChange(event.target.value)
    : undefined;

  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type="search"
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-input bg-background px-md py-sm text-sm text-text-strong outline-none transition focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)]"
      />
    </label>
  );
}
