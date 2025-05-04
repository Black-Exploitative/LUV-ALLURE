// frontend/src/pages/Shop.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ShopHeader from "../components/ShopHeader"; 
import FilterSortBar from "../components/FilterSortBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Parse filters from URL parameters
  const [gridType, setGridType] = useState(parseInt(searchParams.get("grid") || "4"));
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    colour: searchParams.get("color") || "",
    size: searchParams.get("size") || "",
    sort: searchParams.get("sort") || "relevance",
    price: [0, 5000]
  });

  // Update filters when URL parameters change
  useEffect(() => {
    const categoryParam = searchParams.get("category") || "";
    const colorParam = searchParams.get("color") || "";
    const sizeParam = searchParams.get("size") || "";
    const sortParam = searchParams.get("sort") || "relevance";
    const gridParam = parseInt(searchParams.get("grid") || "4");
    
    // Initialize active filters from URL parameters
    const newFilters = {
      category: categoryParam ? [categoryParam] : [],
      colour: colorParam ? [colorParam] : [],
      size: sizeParam ? [sizeParam] : [],
      sort: sortParam,
      price: [0, 5000] // Default price range
    };

    // Update price range if specified in URL
    const priceRange = searchParams.get("price");
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      newFilters.price = [min || 0, max || 5000];
    }

    setFilters(newFilters);
    setGridType(gridParam === 2 ? 2 : 4); // Only allow 2 or 4 columns
  }, [searchParams]);

  // Handle grid type change
  const handleGridChange = (type) => {
    setGridType(type);
    
    // Update URL with new grid type
    const newParams = new URLSearchParams(searchParams);
    newParams.set("grid", type.toString());
    navigate(`/shop?${newParams.toString()}`, { replace: true });
  };

  // Handle filter changes from FilterSortBar
  const handleFiltersChange = (filterData) => {
    console.log("New filters applied:", filterData);
    setFilters(filterData.filters);
    
    // Convert the active filters to URL parameters
    updateUrlWithFilters(filterData);
  };

  // Update URL with active filters
  const updateUrlWithFilters = (filterData) => {
    const newParams = new URLSearchParams();
    
    // Add category filter if present
    if (filterData.filters.category && filterData.filters.category.length > 0) {
      newParams.set("category", filterData.filters.category[0]);
    }
    
    // Add color filter if present
    if (filterData.filters.colour && filterData.filters.colour.length > 0) {
      newParams.set("color", filterData.filters.colour[0]);
    }
    
    // Add size filter if present
    if (filterData.filters.size && filterData.filters.size.length > 0) {
      newParams.set("size", filterData.filters.size[0]);
    }
    
    // Add sort parameter if not default
    if (filterData.sort && filterData.sort !== "relevance") {
      newParams.set("sort", filterData.sort);
    }
    
    // Add grid type if not default
    if (gridType !== 4) {
      newParams.set("grid", gridType.toString());
    }
    
    // Add price range if not default
    const priceRange = filterData.filters.price;
    if (priceRange && (priceRange[0] > 0 || priceRange[1] < 5000)) {
      newParams.set("price", `${priceRange[0]}-${priceRange[1]}`);
    }
    
    // Update URL without reload
    navigate(`/shop?${newParams.toString()}`, { replace: true });
  };

  // Prepare initial filters for FilterSortBar
  const initialFilters = {
    category: filters.category || [],
    colour: filters.colour || [],
    size: filters.size || [],
    price: filters.price || [0, 5000]
  };

  return (
    <div>
      <Navbar />
      <ShopHeader /> 
      <FilterSortBar 
        onGridChange={handleGridChange} 
        onFiltersChange={handleFiltersChange}
        initialFilters={initialFilters}
      />
      <ProductGrid 
        gridType={gridType} 
        filters={filters}
      />
      <Footer />
    </div>
  );
};

export default ShopPage;