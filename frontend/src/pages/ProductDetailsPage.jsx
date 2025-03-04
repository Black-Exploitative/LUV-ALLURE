import ProductCarousel from "../components/ProductCarousel";
import { useLocation } from "react-router-dom";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";
import PurchasedCard from "../components/PurchasedCard";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useRecentlyViewed } from '../context/RecentlyViewedProducts';

const ProductDetailsPage = () => {
  
//TODO: #9 Do a use memo and solve the state reloading concurrently issue here 
  const location = useLocation();
  const product = location.state?.product || {
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

  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();

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
    // Generate a unique ID for this product + size combination
    const productWithSize = {
      ...product,
      id: `${product.name}-${selectedSize || "default"}`,
      selectedSize,
    };

    // Try to add to cart - returns false if already in cart
    // The cart drawer or "already in cart" modal will be shown automatically by the context
    addToCart(productWithSize);
  };

  const { addToRecentlyViewed } = useRecentlyViewed();
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto">
        <div className="p-4 md:p-6 mt-16 md:mt-[72px] flex flex-col md:flex-row md:space-x-8">
          {/* Left Side: Product Carousel - Now takes a bit more space on larger screens */}
          <div className="w-full md:w-3/5 mb-8 md:mb-0">
            <ProductCarousel images={product.images} />
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
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
              onClick={handleAddToCart}
            >
              ADD TO SHOPPING BAG
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
