import ProductCarousel from "../components/ProductCarousel";
import { useLocation } from "react-router-dom";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";
import PurchasedCard from "../components/PurchasedCard";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useRecentlyViewed } from '../context/RecentlyViewedProducts';
import { motion } from "framer-motion";

const ProductDetailsPage = () => {
  const location = useLocation();
  
  // Get product from location if available
  const originalProduct = location.state?.product || {
    name: "SWIVEL ALLURE MAXI DRESS",
    price: "300,000.00",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "../public/images/photo6.jpg",
      "../public/images/photo6.jpg",
      "../public/images/photo11.jpg",
      "../public/images/photo11.jpg",
    ],
  };
  
  // Always add color data regardless of whether it's from location state
  const product = {
    ...originalProduct,
    colors: [
      { name: "BLACK", code: "#000000", inStock: true },
      { name: "BURGUNDY", code: "#800020", inStock: true },
      { name: "BEIGE", code: "#F5F5DC", inStock: true },
      { name: "EMERALD", code: "#50C878", inStock: false }
    ],
    // Add color-specific images if not present
    colorImages: originalProduct.colorImages || {
      "BLACK": originalProduct.images || [
        "../public/images/photo6.jpg",
        "../public/images/photo6.jpg",
        "../public/images/photo11.jpg",
        "../public/images/photo11.jpg",
      ],
      "BURGUNDY": [
        "../public/images/photo11.jpg",
        "../public/images/photo11.jpg",
        "../public/images/photo6.jpg",
        "../public/images/photo6.jpg",
      ],
      "BEIGE": [
        "../public/images/photo6.jpg",
        "../public/images/photo6.jpg",
        "../public/images/photo11.jpg",
        "../public/images/photo11.jpg",
      ],
      "EMERALD": [
        "../public/images/photo11.jpg",
        "../public/images/photo11.jpg",
        "../public/images/photo6.jpg",
        "../public/images/photo6.jpg",
      ]
    },
    description: originalProduct.description || "Make a bold statement with the Swivel Allure Maxi Dress in pastel pink. This striking piece features a high-low hem with a frilled skirt and thigh-high split with cascading ruffle detail, creating a dramatic and elegant silhouette. The crossover lace-up back offers adjustability for a perfect fit, ensuring comfort throughout the night. Ideal for formal events, cocktail parties, or a romantic evening out, this dress is a showstopper for any occasion. Style it with strappy heels and statement accessories for a head-turning look.",
    material: originalProduct.material || "95% Polyester, 5% Elastane",
    care: originalProduct.care || "Hand wash cold, Do not bleach, Line dry, Iron on low heat"
  };
  
  // Set initial color to the first available color
  const initialColor = product.colors[0].name;
  
  // State variables
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [currentImages, setCurrentImages] = useState(
    product.colorImages[initialColor] || product.images
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Update images when color changes
  useEffect(() => {
    if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
      setCurrentImages(product.colorImages[selectedColor]);
    }
  }, [selectedColor, product.colorImages]);

  // Add product to recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

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

  // Check if user can add to cart
  const canAddToCart = selectedSize !== "" && selectedColor !== "";

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    
    setIsAddingToCart(true);
    
    // Add animation delay before adding to cart
    setTimeout(() => {
      // Generate a unique ID for this product + size + color combination
      const productWithSelections = {
        ...product,
        id: `${product.name}-${selectedColor}-${selectedSize}`,
        selectedSize,
        selectedColor,
        image: currentImages[0] // Use the first image of the selected color
      };
  
      // Add to cart
      addToCart(productWithSelections);
      setIsAddingToCart(false);
    }, 500);
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto">
        <div className="p-4 md:p-6 mt-16 md:mt-[72px] flex flex-col md:flex-row md:space-x-8">
          {/* Left Side: Product Carousel */}
          <div className="w-full md:w-3/5 mb-8 md:mb-0">
            <ProductCarousel images={currentImages} />
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full md:w-2/5 space-y-4">
            {/* Product Name */}
            <h1 className="text-2xl font-bold">{product.name}</h1>

            {/* Product Price */}
            <p className="text-xl font-semibold text-gray-700">
              ₦{product.price}
            </p>

            <hr className="border-t border-gray-300 my-4" />

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-medium">COLOR:</p>
                {selectedColor && (
                  <p className="text-sm text-gray-600">{selectedColor}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors && product.colors.map((color, index) => (
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
              {selectedColor === "" && (
                <p className="text-red-500 text-sm mt-2">Please select a color</p>
              )}
            </div>

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
                  : "SELECT COLOR AND SIZE"}
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