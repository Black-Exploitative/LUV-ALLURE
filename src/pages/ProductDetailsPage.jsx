import ProductCarousel from "../components/ProductCarousel";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";

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
    }

    const relatedProducts = [
        {
          name: "Sybil Scarf - Black",
          color: "BLACK",
          price: "78,000",
          image: "../public/images/photo11.jpg",
        },
        {
          name: "Sybil Scarf - Pink",
          color: "PINK",
          price: "56,000",
          image: "../public/images/photo6.jpg",
        },
      ];

  return (
    <>
    <Navbar />
    <div className="p-6 mt-[72px] flex space-x-8">
        {/* Left Side: Product Carousel */}
        <div className="w-1/2">
          <ProductCarousel images={product.images} />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-1/2 space-y-4">
          {/* Product Name */}
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {/* Product Price */}
          <p className="text-xl font-semibold text-gray-700">{product.price}</p>

          <hr className="border-t border-gray-300 my-4" />

          {/* Size Selection */}
          <div>
            <p className="text-lg font-medium mb-2">SIZE:</p>
            <div className="flex space-x-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 active:bg-gray-200"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className="w-full bg-black text-white py-3 hover:bg-gray-800"
            onClick={() => alert("Added to cart!")}
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
       {/* Related Products */}
       <div className="p-6">
        <h2 className="text-xl mb-4">STYLE IT WITH</h2>
        <div className="grid gap-6">
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
        </div>
    </>
  );
};

export default ProductDetailsPage;
