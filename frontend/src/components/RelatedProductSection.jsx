// src/components/RelatedProductsComponent.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cmsService from '../services/cmsService';

// This component will show related products conditionally based on data from the CMS
export const RelatedProductsSection = ({ 
  type, 
  title, 
  productId, 
  products, 
  loading,
  navigate 
}) => {
  // Only render if we have products and we're not loading
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-[15px] mb-4 text-center tracking-wider uppercase">
          {title}
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Don't render anything if there are no products
  if (!products || products.length === 0) {
    return null;
  }

  // Desktop view (row of products)
  const desktopView = (
    <div className="hidden md:grid md:grid-cols-4 gap-[20px]">
      {products.map((product, index) => (
        <div 
          key={product.id || index} 
          className="cursor-pointer"
          onClick={() => navigate(`/product/${product.id || product.handle}`)}
        >
          <img
            src={product.images?.[0] || product.image || "/images/placeholder.jpg"}
            alt={product.title || product.name}
            className="w-full h-[300px] object-cover"
          />
          <div className="mt-2 px-1 space-y-[5px]">
            <p className="text-xs uppercase text-gray-600 tracking-wider">
              {product.color || "DEFAULT"}
            </p>
            <h3 className="text-sm font-semibold tracking-wider">
              {product.title || product.name}
            </h3>
            <p className="text-sm font-normal tracking-wider">
              ₦{typeof product.price === 'number' 
                ? product.price.toLocaleString() 
                : parseFloat(product.price).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // Mobile view (scrollable row)
  const mobileView = (
    <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar px-1 snap-x snap-mandatory scroll-smooth">
      {products.map((product, index) => (
        <div 
          key={product.id || index}
          className="min-w-[70%] max-w-[70%] snap-start cursor-pointer"
          onClick={() => navigate(`/product/${product.id || product.handle}`)}
        >
          <img
            src={product.images?.[0] || product.image || "/images/placeholder.jpg"}
            alt={product.title || product.name}
            className="w-full h-[300px] object-cover"
          />
          <div className="mt-2 px-1 space-y-[5px]">
            <p className="text-xs uppercase text-gray-600 tracking-wider">
              {product.color || "DEFAULT"}
            </p>
            <h3 className="text-sm font-semibold tracking-wider">
              {product.title || product.name}
            </h3>
            <p className="text-sm font-normal tracking-wider">
              ₦{typeof product.price === 'number' 
                ? product.price.toLocaleString() 
                : parseFloat(product.price).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-8 mb-8">
      <h2 className="text-[15px] text-center uppercase tracking-wider mb-6">
        {title}
      </h2>
      {desktopView}
      {mobileView}
    </div>
  );
};

RelatedProductsSection.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  productId: PropTypes.string,
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired
};

// This is a hook to fetch all related products at once
export const useRelatedProducts = (productId) => {
  const [styleWithProducts, setStyleWithProducts] = useState([]);
  const [alsoPurchasedProducts, setAlsoPurchasedProducts] = useState([]);
  const [alsoViewedProducts, setAlsoViewedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!productId) {
        setLoadingRelated(false);
        return;
      }

      try {
        setLoadingRelated(true);

        // Fetch each type of related product from the CMS
        const styleWith = await cmsService.getProductRelationships(
          productId,
          "style-with"
        );
        const alsoPurchased = await cmsService.getProductRelationships(
          productId,
          "also-purchased"
        );
        const alsoViewed = await cmsService.getProductRelationships(
          productId,
          "also-viewed"
        );

        // Update state with fetched products or empty arrays if none
        setStyleWithProducts(styleWith || []);
        setAlsoPurchasedProducts(alsoPurchased || []);
        setAlsoViewedProducts(alsoViewed || []);
      } catch (error) {
        console.error("Error fetching related products:", error);
        // Set empty arrays on error
        setStyleWithProducts([]);
        setAlsoPurchasedProducts([]);
        setAlsoViewedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  return {
    styleWithProducts,
    alsoPurchasedProducts,
    alsoViewedProducts,
    loadingRelated
  };
};

export default {
  RelatedProductsSection,
  useRelatedProducts
};