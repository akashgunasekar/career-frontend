import { ChangeEvent } from "react";

interface Props {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export default function Input({ placeholder, value, onChange, type = "text" }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border p-2 w-full rounded mb-3"
    />
  );
}
