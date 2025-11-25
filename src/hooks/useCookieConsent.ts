import { useCookieYesStore } from '@cookieyes/react';

/**
 * Hook to access CookieYes consent state
 * Must be used within CookieYesProvider
 */
export function useCookieConsent() {
  const preferences = useCookieYesStore((state) => state.preferences);
  const hasConsent = useCookieYesStore((state) => state.hasConsent);
  const getEffectiveConsents = useCookieYesStore((state) => state.getEffectiveConsents);

  return {
    preferences,
    hasConsent,
    getEffectiveConsents,
  };
}

