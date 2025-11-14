import React, { useEffect } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { useEssentialCookies, usePreferenceCookies, useAnalyticsCookies, usePerformanceCookies } from './hooks/useCookies';
import './styles.css';

function App() {
  const { cart, updateCart } = useEssentialCookies();
  const { preferences } = usePreferenceCookies();
  const { trackPageView, trackCategoryView } = useAnalyticsCookies();
  const { trackPageLoad, trackFeatureUsage } = usePerformanceCookies();

  useEffect(() => {
    const startTime = performance.now();

    // Track initial page load
    trackPageView('home');

    const loadTime = performance.now() - startTime;
    trackPageLoad(loadTime);

    // Track feature usage
    trackFeatureUsage('app_loaded');
  }, [trackPageView, trackPageLoad, trackFeatureUsage]);

  const handleCategoryChange = (category: string) => {
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
    trackFeatureUsage('add_to_cart');
  };

  return (
    <div className={`App ${preferences.theme}`}>
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
      </main>
      <Footer />
    </div>
  );
}

export default App;
