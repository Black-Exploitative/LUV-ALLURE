import { useState } from "react";
import { motion } from "framer-motion";
import ProductCarousel from "../components/ProductCarousel";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";
import PurchasedCard from "../components/PurchasedCard";
import { toast } from "react-hot-toast";

const ProductDetailsPage = () => {
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

  const [selectedSize, setSelectedSize] = useState(null);

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
    { name: "Purchased 1", price: 1000, color: "BEIGE", images: "../public/images/photo6.jpg" },
    { name: "Purchased 2", price: 1200, color: "MAROON", images: "../public/images/photo11.jpg" },
    { name: "Purchased 3", price: 800, color: "CORAL", images: "../public/images/photo6.jpg" },
    { name: "Purchased 4", price: 900, color: "BURGUNDY", images: "../public/images/photo11.jpg" },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    toast.success("Added to cart!");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-[72px] flex flex-col md:flex-row md:space-x-8">
        {/* Left Side: Product Carousel */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <ProductCarousel images={product.images} />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* Product Name */}
          <h1 className="text-2xl font-bold tracking-wider">{product.name}</h1>

          {/* Product Price */}
          <p className="text-xl font-semibold text-gray-800">{product.price}</p>

          <hr className="border-t border-gray-300 my-4" />

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-medium">SIZE:</p>
              <button className="text-sm text-gray-600 underline">Size Guide</button>
            </div>
            <div className="flex space-x-3">
              {product.sizes.map((size, index) => (
                <motion.button
                  key={index}
                  className={`border ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-800"
                  } px-5 py-2 min-w-[50px] hover:border-black transition-all duration-200`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors duration-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
          >
            ADD TO SHOPPING BAG
          </motion.button>

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

      {/* Related Products */}
      <div className="max-w-7xl mx-auto p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6 tracking-wider">STYLE IT WITH</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
        <h2 className="text-xl font-semibold mt-16 mb-6 tracking-wider">CUSTOMERS ALSO PURCHASED</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {purchasedProducts.map((product, index) => (
            <PurchasedCard key={index} product={product} />
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-16 mb-6 tracking-wider">CUSTOMERS ALSO VIEWED</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {purchasedProducts.map((product, index) => (
            <PurchasedCard key={index} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;