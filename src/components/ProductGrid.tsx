import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { products, categories } from '../data/products';
import { useAnalyticsCookies, useAdvertisingCookies } from '../hooks/useCookies';

interface ProductGridProps {
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onCategoryChange, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('all-products');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const { trackProductView } = useAnalyticsCookies();
  const { trackAdInteraction } = useAdvertisingCookies();

  useEffect(() => {
    const filtered = selectedCategory === 'all-products'
      ? products
      : products.filter(product => product.category === selectedCategory);
    setFilteredProducts(filtered);
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  const handleProductClick = (product: Product) => {
    trackProductView(product.id);
    // This could trigger personalized ads for similar products
    trackAdInteraction(`product_view_${product.id}`, 'view');
  };

  const handleAddToCartClick = (product: Product) => {
    onAddToCart(product);
    trackAdInteraction(`add_to_cart_${product.id}`, 'conversion');
  };

  return (
    <>
      <div className="main-shop">
        <div className="shop-featured">
          {products.find(p => p.featured) && (
            <div className="image-container">
              <img
                src={products.find(p => p.featured)?.image}
                alt="Featured Product"
                loading="lazy"
              />
              <div className="featured-overlay-left">
                <div className="bottom-left-overlay">
                  <h4 className="overlay-text-heading-left">
                    {products.find(p => p.featured)?.title}
                  </h4>
                  <p className="overlay-text-body-left">
                    $ {products.find(p => p.featured)?.price.toFixed(2)} USD
                  </p>
                </div>
              </div>
              <div className="featured-overlay-right">
                <div className="top-right-overlay">
                  <h4 className="top-right-heading">Featured Item</h4>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shop-category-container">
          <h2>Shop by Category</h2>
          <div className="category-list">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                data-category={category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="shop-products-container" id="shop-products-container">
          {filteredProducts.map(product => (
            <div key={product.id} className="grid-item" onClick={() => handleProductClick(product)}>
              <div className="image-container-shop">
                <img src={product.image} alt={product.title} loading="lazy" />
              </div>
              <div className="text-container-product">
                <h4>{product.title}</h4>
                <p>$ {product.price.toFixed(2)} USD</p>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCartClick(product);
                }}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductGrid;
