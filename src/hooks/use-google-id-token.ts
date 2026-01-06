import { useCallback, useEffect, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (momentListener?: (notification: GooglePromptNotification) => void) => void;
          cancel?: () => void;
          disableAutoSelect?: () => void;
        };
      };
    };
  }

  interface GoogleCredentialResponse {
    credential?: string;
    clientId?: string;
    select_by?: string;
  }

  interface GooglePromptNotification {
    isNotDisplayed?: () => boolean;
    isSkippedMoment?: () => boolean;
    getNotDisplayedReason?: () => string | undefined;
    getSkippedReason?: () => string | undefined;
    getDismissedReason?: () => string | undefined;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Identity cannot load on the server."));
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.getAttribute("data-loaded") === "true") {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity Services script.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services script."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useGoogleIdToken() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!clientId) {
      console.warn("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID env variable.");
      return undefined;
    }

    loadGoogleIdentityScript()
      .then(() => {
        if (!cancelled && window.google?.accounts?.id) {
          setIsReady(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  const requestIdToken = useCallback(async () => {
    if (!clientId) {
      throw new Error("Google client ID is not configured.");
    }
    if (!window.google?.accounts?.id) {
      throw new Error("Google Identity is not ready yet. Please try again.");
    }

    return new Promise<string>((resolve, reject) => {
      let settled = false;

      const handleCredential = (response: GoogleCredentialResponse) => {
        if (settled) return;
        settled = true;
        if (response?.credential) {
          resolve(response.credential);
        } else {
          reject(new Error("Google did not return a credential. Please try again."));
        }
      };

      window.google?.accounts?.id?.initialize({
        client_id: clientId,
        callback: handleCredential,
        ux_mode: "popup",
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google?.accounts?.id?.prompt((notification) => {
        const reason =
          notification?.getNotDisplayedReason?.() ??
          notification?.getSkippedReason?.() ??
          notification?.getDismissedReason?.();

        if (!settled && reason) {
          settled = true;
          reject(new Error(`Google Sign-In cancelled: ${reason}`));
        }
      });
    });
  }, [clientId]);

  return {
    isReady: isReady && Boolean(clientId),
    requestIdToken,
  };
}
