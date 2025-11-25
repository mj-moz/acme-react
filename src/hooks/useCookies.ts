import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { UserPreferences, CartItem, AnalyticsData, PerformanceMetrics, AdInteraction } from '../types';

// Utility functions for cookie management
export const cookieUtils = {
  set: (key: string, value: any, options?: Cookies.CookieAttributes) => {
    Cookies.set(key, JSON.stringify(value), { expires: 365, ...options });
  },

  get: <T>(key: string, defaultValue?: T): T | undefined => {
    const value = Cookies.get(key);
    if (!value) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  },

  remove: (key: string) => {
    Cookies.remove(key);
  }
  // Note: hasConsent function removed - all cookies are now automatically set
};

// Hook for essential cookies (shopping cart, user session)
export const useEssentialCookies = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    return cookieUtils.get<CartItem[]>('shoppingCart', []) || [];
  });

  const [userId, setUserId] = useState<string>(() => {
    return cookieUtils.get<string>('userId', '') || '';
  });

  const updateCart = useCallback((newCart: CartItem[]) => {
    setCart(newCart);
    cookieUtils.set('shoppingCart', newCart, { expires: 30 }); // 30 days for cart persistence
  }, []);

  const updateUserId = useCallback((id: string) => {
    setUserId(id);
    cookieUtils.set('userId', id, { expires: 365 });
  }, []);

  return {
    cart,
    userId,
    updateCart,
    updateUserId
  };
};

// Hook for preference cookies (theme, layout, etc.)
export const usePreferenceCookies = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return cookieUtils.get<UserPreferences>('userPreferences', {
      theme: 'light',
      layout: 'grid',
      currency: 'USD',
      language: 'en'
    }) || {
      theme: 'light',
      layout: 'grid',
      currency: 'USD',
      language: 'en'
    };
  });

  const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    cookieUtils.set('userPreferences', updated, { expires: 365 });
  }, [preferences]);

  return {
    preferences,
    updatePreferences
  };
};

// Hook for analytics cookies
export const useAnalyticsCookies = (hasConsent?: (category: string) => boolean) => {
  // Initialize with default values - don't load from cookies until consent is verified
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => ({
    pageViews: 0,
    popularCategories: {},
    popularProducts: {},
    userJourney: [],
    sessionStart: Date.now()
  }));

  // Load cookies only after consent is verified
  useEffect(() => {
    if (hasConsent && hasConsent('analytics')) {
      const savedData = cookieUtils.get<AnalyticsData>('analyticsData');
      if (savedData) {
        setAnalytics(savedData);
      }
    }
  }, [hasConsent]);

  const trackPageView = useCallback((page: string) => {
    // Only set cookie if user has consented to analytics
    if (!hasConsent || !hasConsent('analytics')) {
      return; // Don't track if no consent function or no consent
    }

    setAnalytics(prev => {
      const updated = {
        ...prev,
        pageViews: prev.pageViews + 1,
        userJourney: [...prev.userJourney, page]
      };
      // Only set cookie if explicitly consented
      if (hasConsent('analytics')) {
        cookieUtils.set('analyticsData', updated, { expires: 365 });
      }
      return updated;
    });
  }, [hasConsent]);

  const trackCategoryView = useCallback((category: string) => {
    // Only set cookie if user has consented to analytics
    if (!hasConsent || !hasConsent('analytics')) {
      return; // Don't track if no consent function or no consent
    }

    setAnalytics(prev => {
      const updated = {
        ...prev,
        popularCategories: {
          ...prev.popularCategories,
          [category]: (prev.popularCategories[category] || 0) + 1
        }
      };
      // Only set cookie if explicitly consented
      if (hasConsent('analytics')) {
        cookieUtils.set('analyticsData', updated, { expires: 365 });
      }
      return updated;
    });
  }, [hasConsent]);

  const trackProductView = useCallback((productId: string) => {
    // Only set cookie if user has consented to analytics
    if (!hasConsent || !hasConsent('analytics')) {
      return; // Don't track if no consent function or no consent
    }

    setAnalytics(prev => {
      const updated = {
        ...prev,
        popularProducts: {
          ...prev.popularProducts,
          [productId]: (prev.popularProducts[productId] || 0) + 1
        }
      };
      // Only set cookie if explicitly consented
      if (hasConsent('analytics')) {
        cookieUtils.set('analyticsData', updated, { expires: 365 });
      }
      return updated;
    });
  }, [hasConsent]);

  return {
    analytics,
    trackPageView,
    trackCategoryView,
    trackProductView
  };
};

// Hook for advertising cookies
export const useAdvertisingCookies = (hasConsent?: (category: string) => boolean) => {
  // Initialize with default values - don't load from cookies until consent is verified
  const [adPreferences, setAdPreferences] = useState(() => ({
    personalizedAds: true,
    retargeting: true,
    frequencyCap: 5,
    interests: [] as string[]
  }));

  // Load cookies only after consent is verified
  useEffect(() => {
    if (hasConsent && hasConsent('advertisement')) {
      const savedData = cookieUtils.get<typeof adPreferences>('adPreferences');
      if (savedData) {
        setAdPreferences(savedData);
      }
    }
  }, [hasConsent]);

  const updateAdPreferences = useCallback((prefs: any) => {
    // Only set cookie if user has consented to advertising
    if (!hasConsent || !hasConsent('advertisement')) {
      return; // Don't set if no consent function or no consent
    }

    const updated = { ...adPreferences, ...prefs };
    setAdPreferences(updated);
    // Only set cookie if explicitly consented
    if (hasConsent('advertisement')) {
      cookieUtils.set('adPreferences', updated, { expires: 90 }); // 90 days for ads
    }
  }, [adPreferences, hasConsent]);

  const trackAdInteraction = useCallback((adId: string, action: string) => {
    // Only set cookie if user has consented to advertising
    if (!hasConsent || !hasConsent('advertisement')) {
      return; // Don't track if no consent function or no consent
    }

    // Track ad interactions for optimization
    const interactions: AdInteraction[] = cookieUtils.get('adInteractions', []) || [];
    interactions.push({ adId, action, timestamp: Date.now() });
    // Only set cookie if explicitly consented
    if (hasConsent('advertisement')) {
      cookieUtils.set('adInteractions', interactions, { expires: 90 });
    }
  }, [hasConsent]);

  return {
    adPreferences,
    updateAdPreferences,
    trackAdInteraction
  };
};

// Hook for performance cookies
export const usePerformanceCookies = (hasConsent?: (category: string) => boolean) => {
  // Initialize with default values - don't load from cookies until consent is verified
  const [performance, setPerformance] = useState<PerformanceMetrics>(() => ({
    pageLoadTime: 0,
    errors: [],
    featuresUsed: [],
    sessionDuration: 0
  }));

  // Load cookies only after consent is verified
  useEffect(() => {
    if (hasConsent && hasConsent('performance')) {
      const savedData = cookieUtils.get<PerformanceMetrics>('performanceMetrics');
      if (savedData) {
        setPerformance(savedData);
      }
    }
  }, [hasConsent]);

  const trackPageLoad = useCallback((loadTime: number) => {
    // Only set cookie if user has consented to performance
    if (!hasConsent || !hasConsent('performance')) {
      return; // Don't track if no consent function or no consent
    }

    setPerformance(prev => {
      const updated = {
        ...prev,
        pageLoadTime: loadTime
      };
      // Only set cookie if explicitly consented
      if (hasConsent('performance')) {
        cookieUtils.set('performanceMetrics', updated, { expires: 730 }); // 2 years
      }
      return updated;
    });
  }, [hasConsent]);

  const trackError = useCallback((error: string) => {
    // Only set cookie if user has consented to performance
    if (!hasConsent || !hasConsent('performance')) {
      return; // Don't track if no consent function or no consent
    }

    setPerformance(prev => {
      const updated = {
        ...prev,
        errors: [...prev.errors, error]
      };
      // Only set cookie if explicitly consented
      if (hasConsent('performance')) {
        cookieUtils.set('performanceMetrics', updated, { expires: 730 });
      }
      return updated;
    });
  }, [hasConsent]);

  const trackFeatureUsage = useCallback((feature: string) => {
    // Only set cookie if user has consented to performance
    if (!hasConsent || !hasConsent('performance')) {
      return; // Don't track if no consent function or no consent
    }

    setPerformance(prev => {
      const updated = {
        ...prev,
        featuresUsed: [...prev.featuresUsed, feature]
      };
      // Only set cookie if explicitly consented
      if (hasConsent('performance')) {
        cookieUtils.set('performanceMetrics', updated, { expires: 730 });
      }
      return updated;
    });
  }, [hasConsent]);

  return {
    performance,
    trackPageLoad,
    trackError,
    trackFeatureUsage
  };
};

// Note: Cookie consent is no longer used - all cookies are automatically set
