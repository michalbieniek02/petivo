const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  // honeypot: bots fill hidden fields, pretend success
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const order = clean(body.order, 50);
  const message = clean(body.message, 3000);

  if (name.length < 2) return Response.json({ error: "Podaj imię." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  if (message.length < 10) return Response.json({ error: "Wiadomość jest zbyt krótka." }, { status: 400 });
  if (body.consent !== true) return Response.json({ error: "Zaznacz zgodę na przetworzenie danych." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ error: "Zbyt wiele wiadomości. Spróbuj ponownie za kilka minut." }, { status: 429 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO is not configured");
    return Response.json({ error: "Formularz jest chwilowo niedostępny. Spróbuj ponownie później." }, { status: 503 });
  }

  const subject = `[Petivo] Wiadomość od ${name}${order ? ` — zamówienie ${order}` : ""}`.replace(/[\r\n]+/g, " ");
  const text = [`Imię: ${name}`, `E-mail: ${email}`, order ? `Numer zamówienia: ${order}` : null, "", message].filter((l) => l !== null).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Petivo <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error("Contact form: Resend error", res.status, await res.text());
      return Response.json({ error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później." }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact form: request failed", err);
    return Response.json({ error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
