import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

/**
 * ColorVariants component that handles both in-page color selection and navigation to separate color variants
 */
const ColorVariants = ({
  product,
  productId,
  selectedColor,
  setSelectedColor,
  setDisplayImages,
}) => {
  const navigate = useNavigate();
  const [colorVariants, setColorVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract color from product name
  const extractColorFromProductName = (productName) => {
    if (productName && productName.includes(" - ")) {
      const parts = productName.split(" - ");
      if (parts.length >= 2) {
        return parts[1].trim();
      }
    }
    return null;
  };

  // Function to create default variants for products without actual variants
  const createDefaultVariants = () => {
    if (!product) return [];

    console.log("Creating default variants for product with no variants");

    // Try to extract color from product name
    const extractedColor = extractColorFromProductName(product.name)?.trim();

    // Base name is either the part before " - " or the full name
    let baseName = product.name;
    if (baseName.includes(" - ")) {
      baseName = baseName.split(" - ")[0].trim();
    }

    // Create default color variants
    let defaultVariants = [];

    // If product has colors defined, use those
    if (product.colors && product.colors.length > 0) {
      defaultVariants = product.colors.map((color) => {
        // Create a slug format consistent with variant products
        const slug = `${baseName
          .toLowerCase()
          .replace(/\s+/g, "-")}---${color.name
          .toLowerCase()
          .replace(/\s+/g, "-")}_${productId}`;

        return {
          id: productId,
          name: `${baseName} - ${color.name}`,
          baseName,
          color: color.name,
          slug,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "/images/placeholder.jpg",
          price: product.price,
          isCurrentVariant: extractedColor
            ? color.name === extractedColor
            : false,
        };
      });
    }
    // If no colors defined but we extracted a color from the name
    else if (extractedColor) {
      const slug = `${baseName
        .toLowerCase()
        .replace(/\s+/g, "-")}---${extractedColor
        .toLowerCase()
        .replace(/\s+/g, "-")}_${productId}`;

      defaultVariants = [
        {
          id: productId,
          name: product.name,
          baseName,
          color: extractedColor,
          slug,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "/images/placeholder.jpg",
          price: product.price,
          isCurrentVariant: true,
        },
      ];
    }
    // If no colors at all, create a default "Black" option
    else {
      const defaultColor = "Black";
      const slug = `${baseName
        .toLowerCase()
        .replace(/\s+/g, "-")}---${defaultColor.toLowerCase()}_${productId}`;

      defaultVariants = [
        {
          id: productId,
          name: `${baseName} - ${defaultColor}`,
          baseName,
          color: defaultColor,
          slug,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "/images/placeholder.jpg",
          price: product.price,
          isCurrentVariant: true,
        },
      ];
    }

    // Update selectedColor if not already set
    if (!selectedColor && defaultVariants.length > 0) {
      const currentVariant =
        defaultVariants.find((v) => v.isCurrentVariant) || defaultVariants[0];
      setSelectedColor(currentVariant.color);
    }

    return defaultVariants;
  };

  // Fetch all color variants when the product loads
  useEffect(() => {
    if (!product || !productId) return;

    // Function to fetch products with the same model tag
    const fetchColorVariants = async () => {
      try {
        setLoading(true);
        // Extract base model name from product name
        let baseModelName;
        if (product.name.includes(" - ")) {
          baseModelName = product.name
            .split(" - ")[0]
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
        } else {
          baseModelName = product.name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
        }

        // Create tag for model search
        const modelTag = `model-${baseModelName}`;
        console.log(`Searching for color variants with tag: ${modelTag}`);

        // Use the correct endpoint for tag-based search
        const response = await api.get(`/search/tag?tag=${modelTag}`);

        if (
          response.data &&
          response.data.products &&
          response.data.products.length > 0
        ) {
          console.log(
            `Found ${response.data.products.length} potential color variants`
          );

          // Process variants to extract color information
          const processedVariants = response.data.products.map((variant) => {
            // Extract color from name or title (assuming format: "Product Name - Color")
            let variantColor = "";
            let baseName = "";

            if (variant.title && variant.title.includes(" - ")) {
              const parts = variant.title.split(" - ");
              baseName = parts[0].trim();
              variantColor = parts[1].trim();
            } else {
              baseName = variant.title || "";
              variantColor =
                extractColorFromProductName(variant.title) ||
                (product.colors && product.colors.length > 0
                  ? product.colors[0].name
                  : "Black");
            }

            // Format the slug for navigation
            const slug = `${baseName
              .toLowerCase()
              .replace(/\s+/g, "-")}---${variantColor
              .toLowerCase()
              .replace(/\s+/g, "-")}_${variant.id}`;

            // Get the appropriate swatch image - use 5th image if available
            let swatchImage;
            if (variant.images && Array.isArray(variant.images)) {
              swatchImage =
                variant.images[4] ||
                variant.images[0] ||
                "/images/placeholder.jpg";
            } else if (variant.image) {
              swatchImage = variant.image;
            } else {
              swatchImage = "/images/placeholder.jpg";
            }

            return {
              id: variant.id,
              name: variant.title || "",
              baseName,
              color: variantColor,
              slug: slug,
              image: swatchImage,
              price: variant.price,
              isCurrentVariant: variant.id === productId,
            };
          });

          setColorVariants(processedVariants);

          // Set the selected color if not already set
          if (!selectedColor) {
            const currentVariant = processedVariants.find(
              (v) => v.isCurrentVariant
            );
            if (currentVariant) {
              setSelectedColor(currentVariant.color);
            }
          }
        } else {
          // No variants found from search, create default variants
          const defaultVariants = createDefaultVariants();
          setColorVariants(defaultVariants);
        }
      } catch (error) {
        console.error("Error fetching color variants:", error);
        // On API error, still create default variants
        const defaultVariants = createDefaultVariants();
        setColorVariants(defaultVariants);
      } finally {
        setLoading(false);

        if (selectedColor) {
          setSelectedColor(selectedColor.trim());
        }
      }
    };

    fetchColorVariants();
  }, [product, productId]);

  // Function to get color code (hex value) from color name
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
      Violet: "#8A2BE2",
      Teal: "#008080",
      Navy: "#000080",
      Coral: "#FF7F50",
      Burgundy: "#800020",
      Olive: "#808000",
      Turquoise: "#40E0D0",
    };

    return colorMap[colorName] || "#CCCCCC"; // Default to gray if color not found
  };

  // Function to get images for a specific color
  const getImagesForColor = (colorName) => {
    if (!product || !colorName) return product?.images || [];

    console.log(`Getting images for color: ${colorName}`);

    // Check if the product has variants with images by color
    if (product.variants && Array.isArray(product.variants)) {
      console.log("Checking variants for color-specific images");

      // Find variant(s) matching this color
      const colorVariants = product.variants.filter((variant) => {
        // Check direct color property
        if (variant.color === colorName) {
          return true;
        }

        // Check selectedOptions array
        if (variant.selectedOptions && Array.isArray(variant.selectedOptions)) {
          return variant.selectedOptions.some(
            (opt) =>
              opt.name &&
              opt.name.toLowerCase() === "color" &&
              opt.value === colorName
          );
        }

        return false;
      });

      if (colorVariants.length > 0) {
        // Check for direct images on variants
        const variantImages = colorVariants
          .flatMap((variant) => variant.images || [variant.image])
          .filter(Boolean);

        if (variantImages.length > 0) {
          return variantImages;
        }
      }
    }

    // Check if there are color-specific images in the product object
    if (product.colorImages && product.colorImages[colorName]) {
      return product.colorImages[colorName];
    }

    // Fallback to the main product images
    return product.images || [];
  };

  // Handle color selection
  const handleColorSelect = (colorName, variantId, variantSlug) => {
  if (variantId === productId) {
    console.log(`Selecting color ${colorName} on current product`);

    setSelectedColor(colorName);
    

    const colorImages = getImagesForColor(colorName);
    setDisplayImages(colorImages.length > 0 ? colorImages : product.images);
  } else {

    console.log(`Navigating to variant with color ${colorName}`);
    navigate(`/product/${variantSlug}`);
  }
};


  // Render loading skeleton for color swatches
  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium">COLOR:</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="w-[40px] h-[40px] bg-gray-200"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // If no product or no color variants found
  if (!product || colorVariants.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium">COLOR:</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {product?.colors?.map((color, index) => (
            <button
              key={index}
              className={`w-[40px] h-[40px] flex transition-all duration-300 items-center justify-center overflow-hidden ${
                selectedColor === color.name
                  ? "ring-1 ring-black"
                  : "ring-1 ring-gray-300"
              } ${color.inStock ? "" : "opacity-40 cursor-not-allowed"}`}
              onClick={() => color.inStock && setSelectedColor(color.name)}
              disabled={!color.inStock}
            >
              <div
                className="w-[34px] h-[34px]"
                style={{
                  backgroundColor: color.code || getColorCode(color.name),
                }}
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-medium">COLOR: {selectedColor}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {colorVariants.map((variant, index) => (
          <button
            key={index}
            className={`w-[40px] h-[40px] flex transition-all cursor-pointer duration-300 items-center justify-center overflow-hidden ${
              selectedColor?.toLowerCase() === variant.color?.toLowerCase()
                ? "ring-1 ring-black"
                : "ring-1 ring-gray-300"
            }`}
            onClick={() =>
              handleColorSelect(variant.color, variant.id, variant.slug)
            }
            title={variant.color}
          >
            <div className="w-[34px] h-[34px] overflow-hidden">
              <img
                src={variant.image}
                alt={`${variant.color} color`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback image if loading fails
                  e.target.src = "/images/placeholder.jpg";
                  // Or show a colored div based on the color name
                  const color = getColorCode(variant.color);
                  e.target.style.backgroundColor = color;
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

ColorVariants.propTypes = {
  product: PropTypes.object.isRequired,
  productId: PropTypes.string.isRequired,
  selectedColor: PropTypes.string,
  setSelectedColor: PropTypes.func.isRequired,
  setDisplayImages: PropTypes.func.isRequired,
};

export default ColorVariants;
