// frontend/src/pages/Shop.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import ShopHeader from "../components/ShopHeader"; // Changed from Banner to ShopHeader
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
      <ShopHeader /> {/* Replaced Banner with ShopHeader */}
      <FilterSortBar onGridChange={handleGridChange} />

      <ProductGrid gridType={gridType} />
      <Footer />
    </div>
  );
};

export default ShopPage;