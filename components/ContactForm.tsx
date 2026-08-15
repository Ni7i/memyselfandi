"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitState("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      const result = await response.json() as { success?: boolean | string };
      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error("Message could not be sent");
      }

      form.reset();
      setSubmitState("sent");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <aside className="cta-card contact-card">
      <span className="cta-stamp">Get in touch</span>
      {submitState === "sent" ? (
        <div className="contact-success" role="status">
          <h3>Message sent.</h3>
          <p>Thanks for writing — I&apos;ll get back to you as soon as I can.</p>
          <button type="button" onClick={() => setSubmitState("idle")}>Write another</button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input type="text" name="name" autoComplete="name" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={5} minLength={10} placeholder="What would you like to talk about?" required />
          </label>
          <label className="honey-field" aria-hidden="true">
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
          {submitState === "error" && (
            <p className="contact-error" role="alert">That didn&apos;t work. Please try again.</p>
          )}
          <button className="contact-submit" type="submit" disabled={submitState === "sending"}>
            {submitState === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
      <div className="contact-socials">
        <a href="https://github.com/Ni7i" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/enis-shorra" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://discord.com/users/nisi_17" target="_blank" rel="noreferrer">Discord</a>
      </div>
    </aside>
  );
}
