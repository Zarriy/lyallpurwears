// Shared submit logic for the two signup forms — the Rs. 500 voucher block on
// the homepage and "The Letter" in the footer. Both post the same shape to
// POST /api/subscribe; keeping the state machine here means they can never
// drift on validation, error copy or double-submit handling.
//
// status: 'idle' | 'sending' | 'done' | 'error'
import { useCallback, useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function useSubscribe(source) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const subscribe = useCallback(
    async (fields) => {
      // Guard the in-flight case: the submit button is disabled while sending,
      // but Enter in a text input can still fire submit again.
      if (status === 'sending') return false;

      const email = (fields.email || '').trim();
      if (!EMAIL_RE.test(email)) {
        setStatus('error');
        setMessage('Please enter a valid email address.');
        return false;
      }

      setStatus('sending');
      setMessage('');

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...fields, email, source }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Something went wrong. Please try again.');
          return false;
        }

        setStatus('done');
        setMessage(
          data.doi
            ? 'Almost there — check your inbox and confirm to get your Rs. 500 code.'
            : 'You are on the list. Your Rs. 500 code is on its way.'
        );
        return true;
      } catch {
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
        return false;
      }
    },
    [status, source]
  );

  return { status, message, subscribe };
}
