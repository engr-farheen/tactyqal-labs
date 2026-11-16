'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitLead } from '@/app/actions';
import { ic, I } from '@/lib/art';

function Send() {
  const { pending } = useFormStatus();
  return <button type="submit" className="btn btn-dark" disabled={pending}><span>{pending ? 'Sending…' : 'Send request'}</span><span className="bi" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ic(I.send) }} /></button>;
}

export default function ContactForm() {
  const [state, action] = useActionState(submitLead, { ok: null });
  if (state.ok) {
    return (
      <div className="form ok" role="status">
        <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" pathLength="100" /><path d="M15 27l8 8 15-17" pathLength="100" /></svg>
        <h3>Thank you!</h3><p>We have your request and will get back to you within 24 hours.</p>
      </div>
    );
  }
  const v = state.values || {};
  return (
    <form className="form" action={action}>
      <h3>Request a free consultation</h3>
      <div className="field"><label htmlFor="f-name">Your name</label><input id="f-name" name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" placeholder="Parent or student name" defaultValue={v.name} /></div>
      <div className="field"><label htmlFor="f-email">Email</label><input id="f-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" defaultValue={v.email} /></div>
      <div className="field"><label htmlFor="f-phone">Phone (optional)</label><input id="f-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 ..." defaultValue={v.phone} /></div>
      <div className="field"><label htmlFor="f-msg">Message (optional)</label><textarea id="f-msg" name="message" maxLength={1000} placeholder="Tell us about your teen and the app idea" defaultValue={v.message} /></div>
      <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state.error && <p className="err" role="alert">{state.error}</p>}
      <Send />
    </form>
  );
}
