import type { ReactNode } from "react";

interface Props {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export default function Field({ label, error, hint, children }: Props) {
  return (
    <label className="adm-field" data-invalid={error ? "true" : undefined}>
      <span className="adm-field-label">{label}</span>
      {children}
      {error ? <span className="adm-error" role="alert">{error}</span> : hint && <span className="adm-hint">{hint}</span>}
    </label>
  );
}
