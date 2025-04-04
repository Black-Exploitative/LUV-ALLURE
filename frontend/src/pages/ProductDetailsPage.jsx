import ProductCarousel from "../components/ProductCarousel";
import { useLocation, useNavigate } from "react-router-dom";
import ExpandableSection from "../components/ExpandableSection";
import SmallProductCard from "../components/SmallProductCard";
import PurchasedCard from "../components/PurchasedCard";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useMemo } from "react";
import Footer from "../components/Footer";
import { useRecentlyViewed } from "../context/RecentlyViewedProducts";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import StarRating from "../components/StarRating";
import cmsService from "../services/cmsService";

const ProductDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawProduct = location.state?.product;

  const [isInWishlist, setIsInWishlist] = useState(false);

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  const [styleWithProducts, setStyleWithProducts] = useState([]);
  const [alsoPurchasedProducts, setAlsoPurchasedProducts] = useState([]);
  const [alsoViewedProducts, setAlsoViewedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!rawProduct || !rawProduct.id) return;
      
      try {
        setLoadingRelated(true);
        
        // Get product ID safely
        const productId = rawProduct.id;
        
        // Fetch each type of related product
        const styleWith = await cmsService.getProductRelationships(productId, 'style-with');
        const alsoPurchased = await cmsService.getProductRelationships(productId, 'also-purchased');
        const alsoViewed = await cmsService.getProductRelationships(productId, 'also-viewed');
        
        // Update state with fetched products
        setStyleWithProducts(styleWith || []);
        setAlsoPurchasedProducts(alsoPurchased || []);
        setAlsoViewedProducts(alsoViewed || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoadingRelated(false);
      }
    };
    
    fetchRelatedProducts();
  }, [rawProduct]);
 
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
        productImages = rawProduct.images.edges.map((edge) => edge.node.url);
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
      productSizes = [
        ...new Set(rawProduct.variants.map((variant) => variant.size)),
      ];
      // Get unique colors
      productColors = [
        ...new Set(rawProduct.variants.map((variant) => variant.color)),
      ].map((colorName) => ({
        name: colorName,
        code: getColorCode(colorName),
        inStock: true,
      }));
    }
    // Extract from other potential structures
    else if (rawProduct.options) {
      const sizeOption = rawProduct.options.find(
        (opt) => opt.name.toLowerCase() === "size"
      );
      productSizes = sizeOption?.values || [];

      const colorOption = rawProduct.options.find(
        (opt) => opt.name.toLowerCase() === "color"
      );
      if (colorOption?.values) {
        productColors = colorOption.values.map((color) => ({
          name: color,
          code: getColorCode(color),
          inStock: true,
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
      if (typeof rawProduct.price === "number") {
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
      colors:
        productColors.length > 0
          ? productColors
          : [{ name: "Blue", code: "#0000FF", inStock: true }],
    };
  };

  // Helper function to convert color names to color codes
  const getColorCode = (colorName) => {
    const colorMap = {
      Black: "#000000",
      White: "#FFFFFF",
      Red: "#FF0000",
      Green: "#008000",
      Blue: "#0000FF",
      Yellow: "#FFFF00",
      Pink: "#FFC0CB",
      Purple: "#800080",
      Orange: "#FFA500",
      Gray: "#808080",
      Brown: "#A52A2A",
      Beige: "#F5F5DC",
      Maroon: "#800000",
      Coral: "#FF7F50",
      Burgundy: "#800020",
    };

    return colorMap[colorName] || "#000000";
  };

  const product = useMemo(
    () => processShopifyProduct(rawProduct),
    [rawProduct]
  );
  console.log("Processed product:", product);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  // Determine if product can be added to cart
  const canAddToCart = useMemo(() => {
    return (
      selectedSize !== "" &&
      (product.colors.length === 0 || selectedColor !== "")
    );
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
      id: `${product.id || product.name}-${selectedColor || "default"}-${
        selectedSize || "default"
      }`,
      selectedSize,
      selectedColor,
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
      <div className="mx-[80px]">
        <div className="mt-[100px] md:mt-[100px] flex flex-col md:flex-row">
          {/* Left Side: Product Carousel */}
          <div className="mb-8 md:mb-0 mr-[50px]">
            <ProductCarousel images={product.images} />

            {/* Related Products - Also inside the max-w-screen-xl container */}
        <div className="mt-[50px]">
          <h2 className="text-[15px] mb-4 text-center">STYLE IT WITH</h2>
          {loadingRelated ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
            </div>
          ) : styleWithProducts.length > 0 ? (
            <div className="grid gap-4 md:gap-6">
              {styleWithProducts.map((product, index) => (
                <SmallProductCard
                  key={product.id || index}
                  image={product.images?.[0] || product.image || "/images/placeholder.jpg"}
                  name={product.title || product.name}
                  color={product.color || "Default"}
                  price={`₦${parseFloat(product.price).toLocaleString()}`}
                  onViewProduct={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          ) : (
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
          )}
        </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="w-[400px] flex flex-col justify-start">
            {/* Product Name */}
            <h1 className="text-xl font-normal">{product.name}</h1>
            {/*  Star Rating */}
            <StarRating onChange={(value) => console.log(`Rated: ${value} stars`)} />

            {/* Product Price */}
            <p className="text-lg font-semibold text-gray-700">
              ₦ {product.price}
            </p>

            <hr className="border-t border-gray-300 my-4" />

            {/* Color Selection - Only show if there are colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium">COLOR:</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-[35px] h-[35px] flex transition-all cursor-pointer duration-300 bg-white items-center justify-center ${
                        selectedColor === color.name
                          ? "border-[0.3px] border-black"
                          : "border border-gray-300"
                      } ${
                        color.inStock ? "" : "opacity-40 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        color.inStock && setSelectedColor(color.name)
                      }
                      disabled={!color.inStock}
                    >
                      <button
                        className={`w-[29px] h-[29px] flex items-center cursor-pointer justify-center`}
                      >
                        <img
                          src="../public/images/stylewith2.jpg"
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium">SIZE:</p>
                <button
                  className="text-[12px] underline cursor-pointer"
                  onClick={() => console.log("Size guide clicked")}
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`border w-[40px] h-[40px] text-[10px] font-normal items-center cursor-pointer ${
                      selectedSize === size
                        ? "border-black border-width-[0.5px]"
                        : "border-gray-300 hover:bg-gray-100"
                    } transition-colors`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              className={`w-full py-3 transition-colors cursor-pointer text-[13.7px] ${
                canAddToCart
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleAddToCart}
              disabled={!canAddToCart || isAddingToCart}
              whileTap={{ scale: canAddToCart ? 0.98 : 1 }}
              animate={{
                opacity: isAddingToCart ? 0.7 : 1,
              }}
            >
              {isAddingToCart
                ? "ADDING TO BAG..."
                : canAddToCart
                ? "ADD TO SHOPPING BAG"
                : `SELECT ${product.colors.length > 0 ? "COLOR AND " : ""}SIZE`}
            </motion.button>

            {/* Wishlist Button */}
            <div
              className="flex items-center justify-start gap-2 text-[13px] mt-4 mb-2 cursor-pointer"
              onClick={toggleWishlist}
            >
              {isInWishlist ? (
                <FaHeart className="h-[15px] w-[15px] text-black" />
              ) : (
                <FiHeart className="h-[15px] w-[15px]" />
              )}
              <span>Add to Wishlist</span>
            </div>

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
              content={
                product.care ||
                "Handle with care. See label for detailed instructions."
              }
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

      </div>
      <div className="mx-[20px] mt-[50px] mb-[100px]">

        {/* Customers Also Purchased Section */}
        {(alsoPurchasedProducts.length > 0 || !loadingRelated) && (
          <>
            <h2 className="text-[15px] text-center uppercase mt-[50px] mb-[50px]">
              ALLURVERS ALSO PURCHASED
            </h2>
            {loadingRelated ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
              </div>
            ) : alsoPurchasedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] md:gap-[20px]">
                {alsoPurchasedProducts.map((product) => (
                  <PurchasedCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.title || product.name,
                      price: parseFloat(product.price),
                      color: product.color || "DEFAULT",
                      images: product.images?.[0] || product.image || "/images/placeholder.jpg"
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] md:gap-[20px]
              ">
                {purchasedProducts.map((product, index) => (
                  <PurchasedCard key={index} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Customers Also Viewed Section */}
        {(alsoViewedProducts.length > 0 || !loadingRelated) && (
          <>
            <h2 className="text-[15px] text-center uppercase mt-[50px] mb-[50px]">
              aLLURVERS ALSO VIEWED
            </h2>
            {loadingRelated ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
              </div>
            ) : alsoViewedProducts.length > 0 ? (
           
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] md:gap-[20px]">
                {alsoViewedProducts.map((product) => (
                  <PurchasedCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.title || product.name,
                      price: parseFloat(product.price),
                      color: product.color || "DEFAULT",
                      images: product.images?.[0] || product.image || "/images/placeholder.jpg"
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] md:gap-[20px]">
                {purchasedProducts.map((product, index) => (
                  <PurchasedCard key={index} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>      
      <Footer />
    </>
  );
};

export default ProductDetailsPage;
