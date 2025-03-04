const sampleProductData = {
    id: "prod_123456",
    name: "SWIVEL ALLURE MAXI DRESS",
    price: "300,000.00",
    description: "A stunning maxi dress perfect for formal occasions. Features an elegant silhouette with a flowing skirt.",
    
    // Basic product information
    sizes: [ "XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Beige", "Pink"],
    
    // Default images to show before a color is selected
    defaultImages: [
      "../public/images/photo11.jpg",
      "../public/images/photo12.jpg",
      "../public/images/photo13.jpg",
      "../public/images/photo7.jpg"
    ],
    
    // Color variant specific images
    colorVariants: {
      "Black": {
        images: [
          "../public/images/photo13.jpg",
          "../public/images/photo13.jpg",
          "../public/images/photo13.jpg",
          "../public/images/photo13.jpg"
        ],
        sku: "SWV-BLK",
        stock: 15
      },
      "White": {
        images: [
          "../public/images/photo3.jpg",
          "../public/images/photo3.jpg",
          "../public/images/photo3.jpg"
        ],
        sku: "SWV-WHT",
        stock: 8
      },
      "Beige": {
        images: [
          "../public/images/photo7.jpg",
          "../public/images/photo7.jpg",
          "../public/images/photo7.jpg"
        ],
        sku: "SWV-BGE",
        stock: 12
      },
      "Pink": {
        images: [
          "../public/images/photo4.jpg",
          "../public/images/photo4.jpg",
          "../public/images/photo4.jpg"
        ],
        sku: "SWV-PNK",
        stock: 5
      }
    },
    
    // Additional product details
    details: {
      material: "95% Polyester, 5% Elastane",
      care: "Machine wash cold, gentle cycle. Do not bleach. Line dry.",
      features: [
        "Flowy maxi length",
        "Adjustable waist tie",
        "Side slit for ease of movement",
        "Hidden back zipper"
      ]
    },
    
    // Metadata for SEO
    meta: {
      title: "Swivel Allure Maxi Dress | Luxury Fashion",
      description: "Elegant maxi dress perfect for formal occasions. Available in multiple colors.",
      keywords: ["maxi dress", "formal dress", "luxury fashion", "evening wear"]
    }
  };
  
  export default sampleProductData;