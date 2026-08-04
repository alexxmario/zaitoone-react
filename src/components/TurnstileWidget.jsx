import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

// Public Turnstile site key. Safe to ship in the bundle — the matching secret
// lives server-side only, as the TURNSTILE_SECRET environment variable.
const SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || '0x4AAAAAAEGEdtF1I25jmTiS';

const SCRIPT_ID = 'cf-turnstile-script';
// render=explicit disables the automatic DOM scan, so the widget is created
// only when this component mounts. Auto-render is unreliable in an SPA: the
// script loads once, but forms mount later on client-side route changes.
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise = null;

const loadTurnstileScript = () => {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => {
      // Allow a later mount to retry the load (blocked network, ad blocker).
      scriptPromise = null;
      reject(new Error('Turnstile script failed to load'));
    });
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Renders the Cloudflare Turnstile widget and reports its token upward.
 *
 * `onToken` is called with a token when the challenge is solved, and with an
 * empty string whenever the token stops being valid (expiry, error, reset).
 * Turnstile tokens are single-use, so the parent must call `reset()` on this
 * component's ref after every submit attempt — otherwise a retry replays an
 * already-redeemed token and siteverify rejects it as timeout-or-duplicate.
 *
 * `onError` is called with a Turnstile error code (or 'script-blocked' when the
 * script itself never loads) so the form can tell "not solved yet" apart from
 * "will never solve" — an ad blocker or a misconfigured widget would otherwise
 * leave the visitor waiting forever on a challenge that cannot complete.
 */
const TurnstileWidget = forwardRef(({ onToken, onError, className = '' }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const [errorCode, setErrorCode] = useState('');

  // Keep the latest callback reachable without re-running the mount effect,
  // which would tear down and re-create the widget on every parent render.
  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onToken, onError]);

  const emit = useCallback((token) => {
    if (onTokenRef.current) onTokenRef.current(token);
  }, []);

  // A failed challenge is not the same as an unsolved one: report the code so
  // the form can offer a way out instead of asking the visitor to keep waiting.
  const fail = useCallback(
    (code) => {
      setErrorCode(String(code || 'unknown'));
      if (onTokenRef.current) onTokenRef.current('');
      if (onErrorRef.current) onErrorRef.current(String(code || 'unknown'));
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
        emit('');
      },
    }),
    [emit]
  );

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    loadTurnstileScript()
      .then(() => {
        // StrictMode mounts effects twice in development; bail if the cleanup
        // already ran, or if this container already carries a widget.
        if (cancelled || !container || widgetIdRef.current !== null) return;

        // Deliberately NOT using turnstile.ready(): it throws when api.js is
        // loaded with async/defer, and it is redundant here because
        // loadTurnstileScript() resolves on the script's load event, by which
        // point window.turnstile is fully initialised.
        try {
          widgetIdRef.current = window.turnstile.render(container, {
            sitekey: SITE_KEY,
            action: 'turnstile-spin-v2',
            theme: 'dark',
            callback: (token) => {
              setErrorCode('');
              emit(token);
            },
            'expired-callback': () => emit(''),
            'timeout-callback': () => emit(''),
            'error-callback': (code) => {
              console.error('Turnstile error-callback:', code);
              fail(code);
              return true;
            },
          });
        } catch (error) {
          // render() throws on an invalid sitekey or a bad container. Surface
          // it instead of leaving an empty widget with no explanation.
          console.error('Turnstile render failed:', error);
          fail('render-failed');
        }
      })
      .catch((error) => {
        console.error('Turnstile:', error.message);
        fail('script-blocked');
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [emit]);

  return (
    <div>
      {/* Must stay mounted even on failure — it is the render target. */}
      <div
        ref={containerRef}
        className={`cf-turnstile ${className}`.trim()}
        data-sitekey={SITE_KEY}
        data-action="turnstile-spin-v2"
      />
      {errorCode && (
        <p className="text-red-400 text-sm mt-2">
          Verificarea anti-spam nu s-a putut încărca. Dezactivează extensiile de
          blocare a reclamelor și reîncarcă pagina, sau sună-ne la{' '}
          <a href="tel:+40737299900" className="text-gold-400 underline">
            +40 737 299 900
          </a>
          .
          <span className="block text-stone-600 text-xs mt-1">Cod eroare: {errorCode}</span>
        </p>
      )}
    </div>
  );
});

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;
