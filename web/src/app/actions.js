'use server';
import { headers } from 'next/headers';

const BASE = process.env.API_URL || 'http://localhost:4000';

// Server action: validates, forwards to the API, and returns a state object for the form.
export async function submitLead(_prev, formData) {
  const get = (k) => (formData.get(k) ?? '').toString().trim();
  const values = { name: get('name'), email: get('email'), phone: get('phone'), message: get('message') };
  if (!values.name || !values.email) return { ok: false, error: 'Please enter your name and email.', values };
  try {
    const h = await headers();
    const r = await fetch(`${BASE}/api/leads`, {
      method: 'POST', cache: 'no-store',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': h.get('x-forwarded-for') ?? '' },
      body: JSON.stringify({ ...values, website: get('website') }),
    });
    if (r.status === 201) return { ok: true };
    const j = await r.json().catch(() => null);
    if (r.status === 429) return { ok: false, error: 'Too many requests. Please try again in a few minutes.', values };
    if (r.status === 400) return { ok: false, error: j?.error?.details?.[0]?.message ? `${j.error.details[0].path}: ${j.error.details[0].message}` : 'Please check your details and try again.', values };
    return { ok: false, error: 'Something went wrong. Please try again, or email us directly.', values };
  } catch {
    return { ok: false, error: 'We could not reach our server. Please email tactyqal.labs@gmail.com.', values };
  }
}
