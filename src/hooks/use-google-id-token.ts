import { useCallback, useEffect, useState } from "react";

const SCRIPT_ID = "google-identity-services";
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (cb?: (notification: GooglePromptNotification) => void) => void;
        };
      };
    };
  }
}

type GooglePromptNotification = {
  isNotDisplayed?: () => boolean;
  isSkippedMoment?: () => boolean;
  getNotDisplayedReason?: () => string | undefined;
  getSkippedReason?: () => string | undefined;
  getDismissedReason?: () => string | undefined;
};

let scriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.getAttribute("data-loaded") === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google script.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Google script."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useGoogleIdToken() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!clientId) {
      console.warn("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID env variable.");
      return;
    }

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (!cancelled && window.google?.accounts?.id) {
          setReady(true);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const requestIdToken = useCallback(async () => {
    if (!clientId || !window.google?.accounts?.id) {
      throw new Error("Google identity service is not ready yet.");
    }

    return new Promise<string>((resolve, reject) => {
      let completed = false;

      const callback = (response: GoogleCredentialResponse) => {
        if (completed) return;
        completed = true;

        if (response?.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("Google did not return a credential."));
        }
      };

      window.google?.accounts?.id?.initialize({
        client_id: clientId,
        callback,
        ux_mode: "popup",
        auto_select: false,
      });

      window.google?.accounts?.id?.prompt((notification) => {
        if (completed) return;
        if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
          completed = true;
          reject(
            new Error(
              notification.getNotDisplayedReason?.() ||
                notification.getSkippedReason?.() ||
                "Google sign-in was cancelled.",
            ),
          );
        }
      });
    });
  }, [clientId]);

  return {
    isReady: ready,
    requestIdToken,
  };
}
