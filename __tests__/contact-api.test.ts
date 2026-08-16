import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

function contactRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("contact API", () => {
  it("rejects invalid submissions before contacting the mail service", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(contactRequest({ name: "A", email: "bad", message: "short" }));

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards a valid message and reports success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: "true" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(contactRequest({
      name: "Website Test",
      email: "test@example.com",
      message: "This is a valid contact message.",
      website: "",
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://formsubmit.co/ajax/shorra.enis@hotmail.com",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Origin: "https://enisshorra.ch" }),
      }),
    );
    const requestOptions = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(requestOptions.body as string)).toMatchObject({
      _url: "https://enisshorra.ch/#contact",
    });
    expect(requestOptions.body).not.toContain("_captcha");
  });
});
