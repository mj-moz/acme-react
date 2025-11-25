import React, { useEffect } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { YouTubeEmbed } from './components/YouTubeEmbed';
import { useEssentialCookies, usePreferenceCookies, useAnalyticsCookies, usePerformanceCookies, cookieUtils } from './hooks/useCookies';
import { useCookieConsent } from './hooks/useCookieConsent';
import './styles.css';
import { CookieYesProvider, CookieBanner } from '@cookieyes/react';
import '@cookieyes/react/components/GDPRBanner.css';

function AppContent() {
  const { cart, updateCart } = useEssentialCookies();
  const { preferences } = usePreferenceCookies();
  const { hasConsent } = useCookieConsent();
  
  // Pass hasConsent to hooks so they can conditionally set cookies
  const { trackPageView, trackCategoryView } = useAnalyticsCookies(hasConsent);
  const { trackPageLoad, trackFeatureUsage } = usePerformanceCookies(hasConsent);

  useEffect(() => {
    const startTime = performance.now();

    // trackPageView will check consent internally and only set cookie if consented
    trackPageView('home');

    const loadTime = performance.now() - startTime;
    
    // trackPageLoad and trackFeatureUsage will check consent internally
    trackPageLoad(loadTime);
    trackFeatureUsage('app_loaded');
  }, [trackPageView, trackPageLoad, trackFeatureUsage]);

  const handleCategoryChange = (category: string) => {
    // Functions will check consent internally and only set cookies if consented
    trackCategoryView(category);
    trackFeatureUsage(`category_filter_${category}`);
  };

  const handleAddToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      updateCart(updatedCart);
    } else {
      updateCart([...cart, { product, quantity: 1 }]);
    }
    
    // trackFeatureUsage will check consent internally
    trackFeatureUsage('add_to_cart');
  };

  return (
    <div className={`App ${preferences.theme}`}>
      <CookieBanner
        jurisdiction="gdpr"
      />
      <Header cartCount={cart.reduce((total, item) => total + item.quantity, 0)} />
      <main>
        <div id="product_title">
          <div>
            <h2>Shop Our Products</h2>
          </div>
        </div>
        <ProductGrid
          onCategoryChange={handleCategoryChange}
          onAddToCart={handleAddToCart}
        />
        
        {/* YouTube Video Section */}
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '2rem auto' }}>
          <h2 style={{ marginBottom: '1rem' }}>Featured Video</h2>
          <YouTubeEmbed 
            videoId="https://www.youtube.com/watch?v=HHi8qOtHnhE"
            title="Featured Product Video"
            consentCategory="functional"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CookieYesProvider
      engineOptions={{ mode: 'local' }}
      storeOptions={{
        loadFromCookie: true,
        onPreferencesChange: (preferences, previousPreferences) => {
          // This callback fires when user changes consent preferences
          // Developer responsibility: Remove cookies when consent is revoked
          
          if (previousPreferences) {
            // User revoked analytics consent → remove analytics cookies
            if (previousPreferences.analytics && !preferences.analytics) {
              cookieUtils.remove('analyticsData');
            }
            
            // User revoked performance consent → remove performance cookies
            if (previousPreferences.performance && !preferences.performance) {
              cookieUtils.remove('performanceMetrics');
            }
            
            // User revoked advertising consent → remove advertising cookies
            if (previousPreferences.advertisement && !preferences.advertisement) {
              cookieUtils.remove('adPreferences');
              cookieUtils.remove('adInteractions');
            }
          }
          
          // Note: Cookie SETTING is handled by hooks (useAnalyticsCookies, usePerformanceCookies)
          // which check consent before setting cookies - no need to handle here
        },
      }}
    >
      <AppContent />
    </CookieYesProvider>
  );
}

export default App;
