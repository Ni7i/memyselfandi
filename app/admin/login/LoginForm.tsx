"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { sendJson } from "../_components/api";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const password = new FormData(form).get("password");
    setSubmitting(true);
    setError(null);

    const result = await sendJson("POST", "/api/admin/login", { password });
    if (result.ok) {
      router.replace("/admin");
      router.refresh();
      return;
    }
    form.reset();
    setError(result.error);
    setSubmitting(false);
  };

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      <label className="adm-field" data-invalid={error ? "true" : undefined}>
        <span className="adm-field-label">Passwort</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
        />
        {error && <span id="login-error" className="adm-error" role="alert">{error}</span>}
      </label>
      <button className="adm-button" type="submit" disabled={submitting}>
        {submitting ? "Prüfe …" : "Anmelden"}
      </button>
    </form>
  );
}
