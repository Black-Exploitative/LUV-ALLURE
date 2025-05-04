
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import FilterSortBar from "../components/FilterSortBar";
import ProductGrid from "../components/ProductGrid"; 
import searchService from "../services/searchApi";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "all";
  const colorParam = searchParams.get("color") || "";
  const sizeParam = searchParams.get("size") || "";
  const sortParam = searchParams.get("sort") || "relevance";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedColor, setSelectedColor] = useState(colorParam);
  const [selectedSize, setSelectedSize] = useState(sizeParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [gridType, setGridType] = useState(4);
  const [pageInfo, setPageInfo] = useState(null);


  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory(categoryParam);
      setSelectedColor(colorParam);
      setSelectedSize(sizeParam);
      setSelectedSort(sortParam);

      performSearch();
    } else {
      setLoading(false);
      setResults([]);
      setTotalResults(0);
    }
  }, [searchQuery, categoryParam, colorParam, sizeParam, sortParam]);

  const performSearch = async (options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchService.searchProducts(searchQuery, {
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        color: selectedColor,
        size: selectedSize,
        sort: selectedSort,
        limit: 20,
        ...options,
      });

      setResults(response.products || []);
      setTotalResults(response.totalCount || response.products?.length || 0);
      setPageInfo(response.pageInfo || null);
    } catch (error) {
      console.error("Error searching products:", error);
      setError("An error occurred while searching. Please try again.");
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes from FilterSortBar
  const handleFiltersChange = (filterData) => {
    // Update local state
    if (filterData.filters.category?.length > 0) {
      setSelectedCategory(filterData.filters.category[0]);
    } else {
      setSelectedCategory("all");
    }

    if (filterData.filters.colour?.length > 0) {
      setSelectedColor(filterData.filters.colour[0]);
    } else {
      setSelectedColor("");
    }

    if (filterData.filters.size?.length > 0) {
      setSelectedSize(filterData.filters.size[0]);
    } else {
      setSelectedSize("");
    }

    // Update sort
    setSelectedSort(filterData.sort);

    // Perform search with new filters
    performSearch({
      category:
        filterData.filters.category?.length > 0
          ? filterData.filters.category[0]
          : undefined,
      color:
        filterData.filters.colour?.length > 0
          ? filterData.filters.colour[0]
          : undefined,
      size:
        filterData.filters.size?.length > 0
          ? filterData.filters.size[0]
          : undefined,
      sort: filterData.sort,
    });
  };

  // Handle grid change
  const handleGridChange = (type) => {
    setGridType(type);
  };

  // Function to handle loading more results (if supported by API)
  const handleLoadMore = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) return;

    setLoading(true);
    try {
      const response = await searchService.searchProducts(searchQuery, {
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        color: selectedColor,
        size: selectedSize,
        sort: selectedSort,
        limit: 20,
        cursor: pageInfo.endCursor,
      });

      setResults((prev) => [...prev, ...(response.products || [])]);
      setTotalResults((prev) => prev + (response.products?.length || 0));
      setPageInfo(response.pageInfo || null);
    } catch (error) {
      console.error("Error loading more products:", error);
      setError("Failed to load more products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare products data for ProductGrid (if needed)
  const transformedProducts = results.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description || "",
    priceValue: typeof product.price === "string" ? parseFloat(product.price) : product.price,
    variants: product.variants || [],
    images: product.images || [product.image || "/images/placeholder.jpg"]
  }));

  return (
    <>
      <Navbar />
      <Banner
        imageUrl="/images/banner.webp"
        title={searchQuery ? `Search: ${searchQuery}` : "Search Results"}
        description={
          totalResults > 0
            ? `${totalResults} results found`
            : "No results found"
        }
      />

      <div className="container mx-auto px-4">
        {/* Filter and Sort Bar - Using the same format as Shop page */}
        <FilterSortBar onGridChange={handleGridChange} />

        {/* Results display */}
        <div className="min-h-screen">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => performSearch()}
                className="mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-thin tracking-wider mb-4">No Results Found</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn't find any products matching "{searchQuery}". Try
                adjusting your filters or browse our curated collections.
              </p>
              <a
                href="/shop"
                className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Browse All Products
              </a>
            </div>
          ) : (
            <>
              <ProductGrid 
                products={transformedProducts} 
                gridType={gridType} 
                loading={loading}
                searchQuery={searchQuery}
              />

              {/* Pagination here Dan */}
              {pageInfo?.hasNextPage && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchResults;