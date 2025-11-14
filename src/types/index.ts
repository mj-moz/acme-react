export interface Product {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  advertising: boolean;
  performance: boolean;
}

export type CookieType = keyof CookiePreferences;

export interface UserPreferences {
  theme: 'light' | 'dark';
  layout: 'grid' | 'list';
  currency: string;
  language: string;
}

export interface AnalyticsData {
  pageViews: number;
  popularCategories: Record<string, number>;
  popularProducts: Record<string, number>;
  userJourney: string[];
  sessionStart: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  errors: string[];
  featuresUsed: string[];
  sessionDuration: number;
}

export interface AdInteraction {
  adId: string;
  action: string;
  timestamp: number;
}
