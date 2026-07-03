"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";

function toDisplayDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
}

function toIsoDate(value: string) {
  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00`);
  if (date.getFullYear() !== Number(year) || date.getMonth() + 1 !== Number(month) || date.getDate() !== Number(day)) return null;
  return `${year}-${month}-${day}`;
}

export function DateInput({ value, onValueChange, className }: {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(() => toDisplayDate(value));

  useEffect(() => {
    setDisplayValue(toDisplayDate(value));
  }, [value]);

  return (
    <Input
      type="text"
      inputMode="numeric"
      className={className}
      value={displayValue}
      maxLength={10}
      placeholder="DD-MM-YYYY"
      aria-label="Date in DD-MM-YYYY format"
      onChange={(event) => {
        const next = event.target.value.replace(/[^\d-]/g, "").toUpperCase();
        setDisplayValue(next);
        if (!next) onValueChange("");
        const isoDate = toIsoDate(next);
        if (isoDate) onValueChange(isoDate);
      }}
    />
  );
}
