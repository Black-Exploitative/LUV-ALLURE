import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import ProductCarousel from "../components/ProductCarousel";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";
import PurchasedCard from "../components/PurchasedCard";
import { useCart } from "../context/CartContext";
import { useRecentlyViewed } from '../context/RecentlyViewedProducts';
import Footer from "../components/Footer";
import sampleProductData from "../data/sampleProductData"; 

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

const ProductDetailsPage = () => {
  // State for selected options and current images
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  
  // Get product data from location or use default
  const location = useLocation();
  const productFromLocation = location.state?.product;
  
  // If no product in location, use sample data
  const product = productFromLocation || sampleProductData;
  
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Related products data for "STYLE IT WITH" section
  const relatedProducts = [
    {
      name: "Sybil Scarf - Black",
      color: "BLACK",
      price: "78,000",
      image: "/images/stylewith.jpg",
    },
    {
      name: "Sybil Scarf - Pink",
      color: "PINK",
      price: "56,000",
      image: "/images/stylewith2.jpg",
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

  // Initialize with default images
  useEffect(() => {
    setCurrentImages(product.defaultImages);
    // Add to recently viewed products
    addToRecentlyViewed(product);
  }, [product, addToRecentlyViewed]);

  // Handle color selection and update images
  const handleColorSelect = (color) => {
    // Toggle color selection
    if (color === selectedColor) {
      setSelectedColor("");
      setCurrentImages(product.defaultImages);
    } else {
      setSelectedColor(color);
      
      // Update images based on selected color
      if (product.colorVariants && product.colorVariants[color]) {
        setCurrentImages(product.colorVariants[color].images);
      } else {
        // Fallback to default images if color variant not found
        setCurrentImages(product.defaultImages);
      }
    }
  };

  // Add to cart with selected options
  const handleAddToCart = () => {
    const productWithOptions = {
      ...product,
      id: `${product.name}-${selectedColor || "default"}-${selectedSize || "default"}`,
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
            <h1 className="text-2xl font-bold">{product.name}</h1>

            {/* Product Price */}
            <p className="text-xl font-semibold text-gray-700">
              ₦{product.price}
            </p>

            <hr className="border-t border-gray-300 my-4" />

            {/* Color Selection - Updated to call handleColorSelect */}
            <div>
              <p className="text-lg font-medium mb-2">COLOR:</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {product.colors.map((color, index) => (
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
                {product.sizes.map((size, index) => (
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
              content="This is a beautiful dress made from high-quality materials. It's lightweight, breathable, and perfect for any occasion."
            />
            <ExpandableSection
              title="SIZE & FIT"
              content="Our dresses are available in various sizes to ensure a perfect fit for everyone. Please refer to the size chart for more details."
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