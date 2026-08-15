import { NextResponse } from "next/server";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "shorra.enis@hotmail.com";

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: ContactRequest;

  try {
    body = (await request.json()) as ContactRequest;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const name = cleanString(body.name);
  const email = cleanString(body.email);
  const message = cleanString(body.message);
  const website = cleanString(body.website);

  // Silently accept bot submissions caught by the hidden field.
  if (website) {
    return NextResponse.json({ success: true });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    name.length < 2 ||
    name.length > 100 ||
    !emailPattern.test(email) ||
    email.length > 254 ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: "New message from enisshorra.ch",
          _template: "table",
          _captcha: "false",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      },
    );

    const result = (await response.json().catch(() => null)) as {
      success?: boolean | string;
      message?: unknown;
    } | null;
    const sent = result?.success === true || result?.success === "true";

    if (!response.ok || !sent) {
      const providerMessage =
        typeof result?.message === "string"
          ? result.message.replaceAll(CONTACT_EMAIL, "[recipient]").slice(0, 300)
          : "No response message";
      console.error("Contact provider rejected the submission", {
        status: response.status,
        message: providerMessage,
      });
      return NextResponse.json({ success: false }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Contact provider could not be reached",
      error instanceof Error ? error.name : "Unknown error",
    );
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
