import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import ProductCarousel from "../components/ProductCarousel";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";
import PurchasedCard from "../components/PurchasedCard";
import { useCart } from "../context/CartContext";
import { useRecentlyViewed } from '../context/RecentlyViewedProducts';
import Footer from "../components/Footer";

// Color to hex mapping
const colorHexMap = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Red": "#E53935",
  "Blue": "#1E88E5",
  "Green": "#43A047",
  "Beige": "#D7CCC8",
  "Pink": "#EC407A",
  "Yellow": "#FDD835"
};

// Hardcoded sample product with working image paths
const sampleProductData = {
  id: "prod_123456",
  name: "SWIVEL ALLURE MAXI DRESS",
  price: "300,000.00",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "White", "Beige", "Pink"],
  defaultImages: [
    "/images/photo6.jpg",
    "/images/photo11.jpg",
    "/images/photo6.jpg", 
    "/images/photo11.jpg"
  ],
  colorVariants: {
    "Black": {
      images: [
        "/images/photo6.jpg",
        "/images/photo11.jpg",
        "/images/photo6.jpg",
        "/images/photo11.jpg"
      ]
    },
    "White": {
      images: [
        "/images/photo11.jpg",
        "/images/photo6.jpg",
        "/images/photo11.jpg",
        "/images/photo6.jpg"
      ]
    },
    "Beige": {
      images: [
        "/images/photo6.jpg",
        "/images/photo11.jpg",
        "/images/photo6.jpg",
        "/images/photo11.jpg"
      ]
    },
    "Pink": {
      images: [
        "/images/photo11.jpg",
        "/images/photo6.jpg",
        "/images/photo11.jpg",
        "/images/photo6.jpg"
      ]
    }
  }
};

const ProductDetailsPage = () => {
  const initialRenderRef = useRef(true);
  const location = useLocation();
  
  // Use location state product or fallback to sample data
  const productData = location.state?.product || sampleProductData;
  
  // State for selected options and current images
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImages, setCurrentImages] = useState(productData.defaultImages);
  
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Sample data for related products
  const relatedProducts = [
    {
      name: "Sybil Scarf - Black",
      color: "BLACK",
      price: "78,000",
      image: "/images/photo6.jpg",
    },
    {
      name: "Sybil Scarf - Pink",
      color: "PINK",
      price: "56,000",
      image: "/images/photo11.jpg",
    },
  ];

  // Sample data for "CUSTOMERS ALSO PURCHASED" section
  const purchasedProducts = [
    {
      name: "Purchased 1",
      price: 1000,
      color: "BEIGE",
      images: "/images/photo6.jpg",
    },
    {
      name: "Purchased 2",
      price: 1200,
      color: "MAROON",
      images: "/images/photo11.jpg",
    },
    {
      name: "Purchased 3",
      price: 800,
      color: "CORAL",
      images: "/images/photo6.jpg",
    },
    {
      name: "Purchased 4",
      price: 900,
      color: "BURGUNDY",
      images: "/images/photo11.jpg",
    },
  ];

  // Run only on first render to avoid infinite loop
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      if (typeof addToRecentlyViewed === 'function') {
        addToRecentlyViewed(productData);
      }
    }
  }, [productData, addToRecentlyViewed]);

  // Handle color selection and update images
  const handleColorSelect = (color) => {
    // Toggle color selection
    if (color === selectedColor) {
      setSelectedColor("");
      setCurrentImages(productData.defaultImages);
    } else {
      setSelectedColor(color);
      
      // Update images based on selected color
      if (productData.colorVariants && 
          productData.colorVariants[color] && 
          productData.colorVariants[color].images) {
        setCurrentImages(productData.colorVariants[color].images);
      } else {
        setCurrentImages(productData.defaultImages);
      }
    }
  };

  // Add to cart with selected options
  const handleAddToCart = () => {
    const productWithOptions = {
      ...productData,
      id: `${productData.name}-${selectedColor || "default"}-${selectedSize || "default"}`,
      selectedSize,
      selectedColor,
    };

    addToCart(productWithOptions);
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto">
        <div className="p-4 md:p-6 mt-16 md:mt-[72px] flex flex-col md:flex-row md:space-x-8">
          {/* Left Side: Product Carousel - Now displays color-specific images */}
          <div className="w-full md:w-3/5 mb-8 md:mb-0">
            <ProductCarousel images={currentImages} />
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full md:w-2/5 space-y-4">
            {/* Product Name */}
            <h1 className="text-2xl font-bold">{productData.name}</h1>

            {/* Product Price */}
            <p className="text-xl font-semibold text-gray-700">
              ₦{productData.price}
            </p>

            <hr className="border-t border-gray-300 my-4" />

            {/* Color Selection */}
            <div>
              <p className="text-lg font-medium mb-2">COLOR:</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {productData.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`relative h-10 w-10 rounded-full cursor-pointer flex items-center justify-center border ${
                      color === "White" ? "border-gray-300" : "border-transparent"
                    } ${selectedColor === color ? "ring-2 ring-black ring-offset-2" : ""}`}
                    style={{ backgroundColor: colorHexMap[color] || color }}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Select ${color} color`}
                  >
                    {selectedColor === color && color === "White" && (
                      <FaCheck className="text-black" />
                    )}
                    {selectedColor === color && color !== "White" && (
                      <FaCheck className="text-white" />
                    )}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="text-sm text-gray-600 mb-4">Selected: {selectedColor}</p>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <p className="text-lg font-medium mb-2">SIZE:</p>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`border ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:bg-gray-100"
                    } px-4 py-2 rounded active:bg-gray-200 transition-colors`}
                    onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button - Disabled if no color or size selected */}
            <button
              className={`w-full py-3 transition-colors ${
                !selectedColor || !selectedSize
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              onClick={handleAddToCart}
              disabled={!selectedColor || !selectedSize}
            >
              {!selectedColor && !selectedSize
                ? "SELECT COLOR AND SIZE"
                : !selectedColor
                ? "SELECT COLOR"
                : !selectedSize
                ? "SELECT SIZE"
                : "ADD TO SHOPPING BAG"}
            </button>

            <hr className="border-t border-gray-300 my-4" />

            {/* Expandable Sections */}
            <ExpandableSection
              title="PRODUCT DETAILS"
              content="This is a beautiful Sybil Scarf made from high-quality materials. It's lightweight, breathable, and perfect for any season."
            />
            <ExpandableSection
              title="SIZE & FIT"
              content="Our scarves are available in various sizes to ensure a perfect fit for everyone. Please refer to the size chart for more details."
            />
            <ExpandableSection
              title="SHIPPING"
              content="We offer fast and reliable shipping worldwide. Your order will be processed and shipped within 2-3 business days."
            />
            <ExpandableSection
              title="RETURNS"
              content="If you're not satisfied with your purchase, you may return the item within 30 days for a full refund."
            />
          </div>
        </div>

        {/* Related Products - Using responsive grid */}
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

          {/* Purchased Products Section - Using responsive grid */}
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