import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Props = {
  action: "vacation_quote" | "about_quick_note";
  siteKey: string;
  submissionState: "idle" | "submitting" | "loading";
};

const scriptId = "cloudflare-turnstile-script";

export function SpamProtectionFields({ action, siteKey, submissionState }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const previousSubmissionState = useRef(submissionState);
  const [startedAt, setStartedAt] = useState("");

  useEffect(() => {
    setStartedAt(Date.now().toString());
  }, []);

  useEffect(() => {
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        appearance: "interaction-only",
        theme: "light",
      });
    };

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener("load", renderWidget);
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderWidget);
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      existingScript?.removeEventListener("load", renderWidget);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [action, siteKey]);

  useEffect(() => {
    const justFinished = previousSubmissionState.current !== "idle" && submissionState === "idle";
    previousSubmissionState.current = submissionState;

    if (justFinished && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      setStartedAt(Date.now().toString());
    }
  }, [submissionState]);

  return (
    <>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="formStartedAt" value={startedAt} />
      <div ref={containerRef} aria-label="Spam protection verification" />
    </>
  );
}
