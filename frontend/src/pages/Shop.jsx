import { useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import FilterSortBar from "../components/FilterSortBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

const ShopPage = () => {
  
  const [gridType, setGridType] = useState(4);

  const handleGridChange = (type) => {
    setGridType(type);
  };

  return (
    <div>
      <Navbar />
      <Banner
        imageUrl="/images/banner.webp"
        title="Shop the Latest Trends"
        description="Find your perfect style today."
      />
      <FilterSortBar onGridChange={handleGridChange} />

      <ProductGrid gridType={gridType} />
      <Footer />
    </div>
  );
};

export default ShopPage;
