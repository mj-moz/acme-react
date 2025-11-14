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
export const useAnalyticsCookies = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => {
    return cookieUtils.get<AnalyticsData>('analyticsData', {
      pageViews: 0,
      popularCategories: {},
      popularProducts: {},
      userJourney: [],
      sessionStart: Date.now()
    }) || {
      pageViews: 0,
      popularCategories: {},
      popularProducts: {},
      userJourney: [],
      sessionStart: Date.now()
    };
  });

  const trackPageView = useCallback((page: string) => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        pageViews: prev.pageViews + 1,
        userJourney: [...prev.userJourney, page]
      };
      cookieUtils.set('analyticsData', updated, { expires: 365 });
      return updated;
    });
  }, []);

  const trackCategoryView = useCallback((category: string) => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        popularCategories: {
          ...prev.popularCategories,
          [category]: (prev.popularCategories[category] || 0) + 1
        }
      };
      cookieUtils.set('analyticsData', updated, { expires: 365 });
      return updated;
    });
  }, []);

  const trackProductView = useCallback((productId: string) => {
    setAnalytics(prev => {
      const updated = {
        ...prev,
        popularProducts: {
          ...prev.popularProducts,
          [productId]: (prev.popularProducts[productId] || 0) + 1
        }
      };
      cookieUtils.set('analyticsData', updated, { expires: 365 });
      return updated;
    });
  }, []);

  return {
    analytics,
    trackPageView,
    trackCategoryView,
    trackProductView
  };
};

// Hook for advertising cookies
export const useAdvertisingCookies = () => {
  const [adPreferences, setAdPreferences] = useState(() => {
    return cookieUtils.get('adPreferences', {
      personalizedAds: true,
      retargeting: true,
      frequencyCap: 5,
      interests: [] as string[]
    }) || {
      personalizedAds: true,
      retargeting: true,
      frequencyCap: 5,
      interests: [] as string[]
    };
  });

  const updateAdPreferences = useCallback((prefs: any) => {
    const updated = { ...adPreferences, ...prefs };
    setAdPreferences(updated);
    cookieUtils.set('adPreferences', updated, { expires: 90 }); // 90 days for ads
  }, [adPreferences]);

  const trackAdInteraction = useCallback((adId: string, action: string) => {
    // Track ad interactions for optimization
    const interactions: AdInteraction[] = cookieUtils.get('adInteractions', []) || [];
    interactions.push({ adId, action, timestamp: Date.now() });
    cookieUtils.set('adInteractions', interactions, { expires: 90 });
  }, []);

  return {
    adPreferences,
    updateAdPreferences,
    trackAdInteraction
  };
};

// Hook for performance cookies
export const usePerformanceCookies = () => {
  const [performance, setPerformance] = useState<PerformanceMetrics>(() => {
    return cookieUtils.get<PerformanceMetrics>('performanceMetrics', {
      pageLoadTime: 0,
      errors: [],
      featuresUsed: [],
      sessionDuration: 0
    }) || {
      pageLoadTime: 0,
      errors: [],
      featuresUsed: [],
      sessionDuration: 0
    };
  });

  const trackPageLoad = useCallback((loadTime: number) => {
    setPerformance(prev => {
      const updated = {
        ...prev,
        pageLoadTime: loadTime
      };
      cookieUtils.set('performanceMetrics', updated, { expires: 730 }); // 2 years
      return updated;
    });
  }, []);

  const trackError = useCallback((error: string) => {
    setPerformance(prev => {
      const updated = {
        ...prev,
        errors: [...prev.errors, error]
      };
      cookieUtils.set('performanceMetrics', updated, { expires: 730 });
      return updated;
    });
  }, []);

  const trackFeatureUsage = useCallback((feature: string) => {
    setPerformance(prev => {
      const updated = {
        ...prev,
        featuresUsed: [...prev.featuresUsed, feature]
      };
      cookieUtils.set('performanceMetrics', updated, { expires: 730 });
      return updated;
    });
  }, []);

  return {
    performance,
    trackPageLoad,
    trackError,
    trackFeatureUsage
  };
};

// Note: Cookie consent is no longer used - all cookies are automatically set
