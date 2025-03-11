import ProductCarousel from "../components/ProductCarousel";
import { useLocation } from "react-router-dom";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";
import PurchasedCard from "../components/PurchasedCard";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useMemo } from "react";
import Footer from "../components/Footer";
import { useRecentlyViewed } from '../context/RecentlyViewedProducts';
import { motion } from "framer-motion";

const ProductDetailsPage = () => {
  const location = useLocation();
  const rawProduct = location.state?.product;
  
  // Fallback product if none is passed
  const defaultProduct = {
    title: "SWIVEL ALLURE MAXI DRESS",
    price: "300,000.00",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "../public/images/photo6.jpg",
      "../public/images/photo6.jpg",
      "../public/images/photo11.jpg",
      "../public/images/photo11.jpg",
    ],
  };

  // Process the product from Shopify API format
  const processShopifyProduct = (rawProduct) => {
    if (!rawProduct) return defaultProduct;
    
    console.log("Raw product from navigation:", rawProduct);
    
    // Extract images
    let productImages = [];
    if (rawProduct.images) {
      // Direct array format
      if (Array.isArray(rawProduct.images)) {
        productImages = rawProduct.images;
      } 
      // Edges format from Shopify API
      else if (rawProduct.images.edges) {
        productImages = rawProduct.images.edges.map(edge => edge.node.url);
      }
    }
    
    // If no images found, use the ones from the transformed product
    if (productImages.length === 0 && rawProduct.priceValue !== undefined) {
      productImages = rawProduct.images || [];
    }
    
    // Extract sizes and colors from variants
    let productSizes = [];
    let productColors = [];
    
    // Extract from variants structure provided
    if (rawProduct.variants && Array.isArray(rawProduct.variants)) {
      // Get unique sizes
      productSizes = [...new Set(rawProduct.variants.map(variant => variant.size))];
      // Get unique colors
      productColors = [...new Set(rawProduct.variants.map(variant => variant.color))].map(colorName => ({
        name: colorName,
        code: getColorCode(colorName),
        inStock: true
      }));
    } 
    // Extract from other potential structures
    else if (rawProduct.options) {
      const sizeOption = rawProduct.options.find(opt => 
        opt.name.toLowerCase() === "size"
      );
      productSizes = sizeOption?.values || [];
      
      const colorOption = rawProduct.options.find(opt => 
        opt.name.toLowerCase() === "color"
      );
      if (colorOption?.values) {
        productColors = colorOption.values.map(color => ({
          name: color,
          code: getColorCode(color),
          inStock: true
        }));
      }
    }
    // Use sizes if already extracted in product grid
    else if (rawProduct.sizes) {
      productSizes = rawProduct.sizes;
    }
    
    // Format price
    let formattedPrice = "0.00";
    if (rawProduct.priceValue) {
      // Already processed price
      formattedPrice = rawProduct.priceValue.toLocaleString();
    } else if (rawProduct.variants?.edges?.length > 0) {
      // First variant price from Shopify API
      const price = rawProduct.variants.edges[0].node.price?.amount;
      if (price) {
        formattedPrice = parseFloat(price).toLocaleString();
      }
    } else if (rawProduct.price) {
      // Direct price property
      if (typeof rawProduct.price === 'number') {
        formattedPrice = rawProduct.price.toLocaleString();
      } else {
        formattedPrice = rawProduct.price;
      }
    }
    
    return {
      id: rawProduct.id,
      name: rawProduct.title || rawProduct.name,
      price: formattedPrice,
      images: productImages.length > 0 ? productImages : defaultProduct.images,
      description: rawProduct.description || "No description available",
      sizes: productSizes.length > 0 ? productSizes : defaultProduct.sizes,
      colors: productColors.length > 0 ? productColors : [{ name: "Blue", code: "#0000FF", inStock: true }]
    };
  };

  // Helper function to convert color names to color codes
  const getColorCode = (colorName) => {
    const colorMap = {
      "Black": "#000000",
      "White": "#FFFFFF",
      "Red": "#FF0000",
      "Green": "#008000",
      "Blue": "#0000FF",
      "Yellow": "#FFFF00",
      "Pink": "#FFC0CB",
      "Purple": "#800080",
      "Orange": "#FFA500",
      "Gray": "#808080",
      "Brown": "#A52A2A",
      "Beige": "#F5F5DC",
      "Maroon": "#800000",
      "Coral": "#FF7F50",
      "Burgundy": "#800020",
    };
    
    return colorMap[colorName] || "#000000";
  };

  const product = useMemo(() => processShopifyProduct(rawProduct), [rawProduct]);
  console.log("Processed product:", product);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  // Determine if product can be added to cart
  const canAddToCart = useMemo(() => {
    return selectedSize !== "" && (product.colors.length === 0 || selectedColor !== "");
  }, [selectedSize, selectedColor, product.colors]);

  const relatedProducts = [
    {
      name: "Sybil Scarf - Black",
      color: "BLACK",
      price: "78,000",
      image: "../public/images/stylewith.jpg",
    },
    {
      name: "Sybil Scarf - Pink",
      color: "PINK",
      price: "56,000",
      image: "../public/images/stylewith2.jpg",
    },
  ];

  const purchasedProducts = [
    {
      name: "Purchased 1",
      price: 1000,
      color: "BEIGE",
      images: "../public/images/photo6.jpg",
    },
    {
      name: "Purchased 2",
      price: 1200,
      color: "MAROON",
      images: "../public/images/photo11.jpg",
    },
    {
      name: "Purchased 3",
      price: 800,
      color: "CORAL",
      images: "../public/images/photo6.jpg",
    },
    {
      name: "Purchased 4",
      price: 900,
      color: "BURGUNDY",
      images: "../public/images/photo11.jpg",
    },
  ];

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    
    setIsAddingToCart(true);
    
    // Generate a unique ID for this product + size + color combination
    const productWithOptions = {
      ...product,
      id: `${product.id || product.name}-${selectedColor || "default"}-${selectedSize || "default"}`,
      selectedSize,
      selectedColor
    };

    // Try to add to cart - returns false if already in cart
    addToCart(productWithOptions);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 800);
  };

  const { addToRecentlyViewed } = useRecentlyViewed();
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  return (
    <>
      <div className="max-w-screen-xl mx-[300px]">
        <div className="p-4 md:p-6 mt-16 md:mt-[72px] flex flex-col md:flex-row md:space-x-8">
          {/* Left Side: Product Carousel */}
          <div className="w-[1400px] md:w-7/9 mb-8 md:mb-0">
            <ProductCarousel images={product.images} />
          </div>

          {/* Right Side: Product Details */}
          <div className="w-[400px] md:w-2/9 space-y-4">
            {/* Product Name */}
            <h1 className="text-2xl font-bold">{product.name}</h1>

            {/* Product Price */}
            <p className="text-xl font-semibold text-gray-700">
              ₦{product.price}
            </p>

            <hr className="border-t border-gray-300 my-4" />

            {/* Color Selection - Only show if there are colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-medium">COLOR:</p>
                  {selectedColor && (
                    <p className="text-sm text-gray-600">{selectedColor}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 transition-all duration-300 ${
                        selectedColor === color.name
                          ? "border-2 border-black"
                          : "border border-gray-300"
                      } ${color.inStock ? "" : "opacity-40 cursor-not-allowed"}`}
                      style={{ 
                        backgroundColor: color.code,
                      }}
                      onClick={() => color.inStock && setSelectedColor(color.name)}
                      disabled={!color.inStock}
                    >
                      {!color.inStock && (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-px bg-gray-400 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor === "" && product.colors.length > 0 && (
                  <p className="text-red-500 text-sm mt-2">Please select a color</p>
                )}
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-medium">SIZE:</p>
                <button className="text-sm underline" onClick={() => console.log("Size guide clicked")}>
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`border min-w-[50px] ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:bg-gray-100"
                    } px-4 py-2 transition-colors`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize === "" && (
                <p className="text-red-500 text-sm mt-2">Please select a size</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              className={`w-full py-3 transition-colors ${
                canAddToCart 
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleAddToCart}
              disabled={!canAddToCart || isAddingToCart}
              whileTap={{ scale: canAddToCart ? 0.98 : 1 }}
              animate={{ 
                opacity: isAddingToCart ? 0.7 : 1
              }}
            >
              {isAddingToCart 
                ? "ADDING TO BAG..." 
                : canAddToCart 
                  ? "ADD TO SHOPPING BAG" 
                  : `SELECT ${product.colors.length > 0 ? "COLOR AND " : ""}SIZE`}
            </motion.button>

            {/* Wishlist Button */}
            <button className="w-full border border-black py-3 mt-2 hover:bg-gray-100 transition-colors">
              ADD TO WISHLIST
            </button>

            <hr className="border-t border-gray-300 my-4" />

            {/* Expandable Sections */}
            <ExpandableSection
              title="PRODUCT DETAILS"
              content={product.description}
            />
            <ExpandableSection
              title="MATERIAL & COMPOSITION"
              content={product.material || "Information not available"}
            />
            <ExpandableSection
              title="SIZE & FIT"
              content="Our dresses are available in various sizes to ensure a perfect fit for everyone. Please refer to the size chart for more details."
            />
            <ExpandableSection
              title="CARE INSTRUCTIONS"
              content={product.care || "Handle with care. See label for detailed instructions."}
            />
            <ExpandableSection
              title="SHIPPING"
              content="We offer fast and reliable shipping nationwide. Your order will be processed and shipped within 2-3 business days."
            />
            <ExpandableSection
              title="RETURNS"
              content="If you're not satisfied with your purchase, you may return the item within 30 days for a full refund."
            />
          </div>
        </div>

        {/* Related Products */}
        <div className="p-4 md:p-6">
          <h2 className="text-xl mb-4">STYLE IT WITH</h2>
          <div className="grid gap-4 md:gap-6">
            {relatedProducts.map((product, index) => (
              <SmallProductCard
                key={index}
                image={product.image}
                name={product.name}
                color={product.color}
                price={product.price}
                onViewProduct={() => console.log(`Viewing ${product.name}`)}
              />
            ))}
          </div>

          {/* Purchased Products Section */}
          <h2 className="text-xl font-semibold mt-8 mb-4">
            CUSTOMERS ALSO PURCHASED
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {purchasedProducts.map((product, index) => (
              <PurchasedCard key={index} product={product} />
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            CUSTOMERS ALSO VIEWED
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {purchasedProducts.map((product, index) => (
              <PurchasedCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;