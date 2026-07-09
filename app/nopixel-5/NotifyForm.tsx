'use client';

import { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';

// Email capture for the NoPixel 5.0 / V launch. The first-mover payoff: when the
// new hacks drop and we ship trainers, we email everyone who signed up here.
// Consent is explicit (GDPR); a hidden honeypot field absorbs bots.
export default function NotifyForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    if (!consent) {
      setError('Please tick the box so we can email you.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, company, source: 'nopixel-5' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('done');
      } else {
        setStatus('error');
        setError(data.error === 'invalid_email' ? 'That email looks off — check it?' : 'Something went wrong. Try again in a moment.');
      }
    } catch {
      setStatus('error');
      setError('Network error. Try again in a moment.');
    }
  };

  if (status === 'done') {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg bg-[#54FFA4]/10 border border-[#54FFA4]/40 px-5 py-4 text-[#54FFA4]">
        <Check className="w-5 h-5 flex-shrink-0" />
        <span className="font-semibold">You&apos;re on the list — we&apos;ll email you the moment 5.0 trainers go live.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md text-left">
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="notify-email" className="sr-only">
          Email address
        </label>
        <input
          id="notify-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          className="flex-1 rounded-lg bg-[#0F1B21] border-2 border-[#54FFA4]/25 px-4 py-3 text-white placeholder-gray-500 focus:border-[#54FFA4]/70 focus:outline-none"
        />
        {/* Honeypot: hidden from humans, tempting to bots. */}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#54FFA4] px-6 py-3 font-bold text-[#0F1B21] transition-all hover:bg-[#45e894] hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bell className="w-5 h-5" />}
          Notify me
        </button>
      </div>
      <label className="mt-3 flex items-start gap-2 text-sm text-gray-400">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-[#54FFA4]"
        />
        <span>
          Email me once when NoPixel 5.0 trainers launch. No spam, one-off.{' '}
          <a href="/privacy" className="text-[#54FFA4] underline underline-offset-2">
            Privacy
          </a>
          .
        </span>
      </label>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
