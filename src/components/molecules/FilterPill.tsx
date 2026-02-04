import React from 'react';
import { Pill } from '../atoms/Pill';

type Option<T> = { value: T; label: string; icon?: string };

export function FilterPill<T extends string | number>({
  label,
  options,
  current,
  onChange
}: {
  label: string;
  options: Option<T>[];
  current: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="filter-pill">
      <p className="label">{label}</p>
      <div className="pill-row">
        {options.map((o) => (
          <Pill
            key={String(o.value)}
            active={current === o.value}
            as="button"
            onClick={() => onChange(o.value)}
            icon={o.icon}
          >
            {o.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
