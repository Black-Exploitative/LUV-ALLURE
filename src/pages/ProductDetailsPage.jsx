import ProductCarousel from "./ProductCarousel";

const ProductDetailsPage = () => {
  const productImages = [
    "../public/images/photo6.jpg",
    "../public/images/photo6.jpg",
    "https://via.placeholder.com/500x500?text=Image3",
    "https://via.placeholder.com/500x500?text=Image4",
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product Name</h1>
      <ProductCarousel images={productImages} />
    </div>
  );
};

export default ProductDetailsPage;
