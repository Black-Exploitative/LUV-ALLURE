// frontend/src/components/CustomersReviews.jsx - Removed mock data
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import ReviewModal from "./ReviewModal";
import api from "../services/api";

const CustomersReviews = ({ productId, productName }) => {
  const [qualityRating, setQualityRating] = useState(null);
  const [fitRating, setFitRating] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // State for reviews and stats
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load reviews and check review eligibility
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      
      try {
        if (!productId || productId === "Product ID") {
          // Load local reviews for demo/test products
          const storedReviews = localStorage.getItem(`reviews-${productName}`);
          if (storedReviews) {
            const parsedReviews = JSON.parse(storedReviews);
            setReviews(parsedReviews);
            calculateReviewStats(parsedReviews);
          }
        } else {
          // Fetch real reviews from API
          const response = await api.get(`/products/${productId}/reviews`);
          if (response.data && response.data.reviews) {
            setReviews(response.data.reviews);
            calculateReviewStats(response.data.reviews);
            
            // If the API provides pre-calculated stats, use those
            if (response.data.averageRating) {
              setAverageRating(response.data.averageRating);
            }
            if (response.data.totalReviews) {
              setTotalReviews(response.data.totalReviews);
            }
            if (response.data.ratingCounts) {
              setRatingCounts(response.data.ratingCounts);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Load local reviews as fallback
        const storedReviews = localStorage.getItem(`reviews-${productName}`);
        if (storedReviews) {
          const parsedReviews = JSON.parse(storedReviews);
          setReviews(parsedReviews);
          calculateReviewStats(parsedReviews);
        }
      }
      
      // Check if user can leave a review
      try {
        if (productId && productId !== "Product ID") {
          const eligibilityResponse = await api.get(`/products/${productId}/can-review`);
          if (eligibilityResponse.data) {
            setCanReview(eligibilityResponse.data.canReview);
          }
        } else {
          // For demo/test products, always allow reviews
          setCanReview(true);
        }
      } catch (error) {
        console.error('Error checking review eligibility:', error);
        setCanReview(true); // Default to allowing reviews if check fails
      }
      
      setLoading(false);
    };
    
    fetchReviews();
  }, [productId, productName]);

  // Calculate review statistics from review data
  const calculateReviewStats = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) {
      setAverageRating(0);
      setTotalReviews(0);
      setRatingCounts({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      return;
    }
    
    // Count reviews for each rating
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalStars = 0;
    
    reviewsList.forEach(review => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        counts[rating] = (counts[rating] || 0) + 1;
        totalStars += rating;
      }
    });
    
    // Calculate average rating
    const avg = totalStars / reviewsList.length;
    const roundedAvg = Math.round(avg * 10) / 10; // Round to 1 decimal
    
    setRatingCounts(counts);
    setTotalReviews(reviewsList.length);
    setAverageRating(roundedAvg);
    
    // Calculate quality and fit ratings
    calculateQualityAndFit(reviewsList);
  };

  // Calculate quality and fit ratings
  const calculateQualityAndFit = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) {
      setQualityRating(null);
      setFitRating(null);
      return;
    }
    
    // Calculate quality rating
    const qualityValues = {
      "Very Low": 1,
      "Low": 2,
      "Okay": 3,
      "High": 4,
      "Very High": 5
    };
    
    let qualitySum = 0;
    let qualityCount = 0;
    
    reviewsList.forEach(review => {
      if (review.quality && qualityValues[review.quality]) {
        qualitySum += qualityValues[review.quality];
        qualityCount++;
      }
    });
    
    if (qualityCount > 0) {
      const avgQuality = qualitySum / qualityCount;
      const qualityLabels = ["Very Low", "Low", "Okay", "High", "Very High"];
      setQualityRating(qualityLabels[Math.round(avgQuality) - 1] || "Not Rated");
    } else {
      setQualityRating("Not Rated");
    }
    
    // Calculate fit rating
    const fitCounts = { 
      "Runs small": 0, 
      "True to size": 0, 
      "Runs large": 0 
    };
    
    reviewsList.forEach(review => {
      if (review.overallFit && fitCounts[review.overallFit] !== undefined) {
        fitCounts[review.overallFit]++;
      }
    });
    
    // Find the most common fit
    let maxFit = "Not Rated";
    let maxCount = 0;
    
    for (const [fit, count] of Object.entries(fitCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxFit = fit;
      }
    }
    
    setFitRating(maxCount > 0 ? maxFit : "Not Rated");
  };

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    try {
      // Add product info to review
      const reviewWithProduct = {
        ...reviewData,
        productId,
        productName
      };
      
      // If connected to backend, submit review to API
      if (productId && productId !== "Product ID") {
        await api.post(`/products/${productId}/reviews`, reviewWithProduct);
      }
      
      // Also save to localStorage for immediate display
      const newReviews = [reviewWithProduct, ...reviews];
      setReviews(newReviews);
      localStorage.setItem(`reviews-${productName}`, JSON.stringify(newReviews));
      
      // Update stats
      calculateReviewStats(newReviews);
      
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("There was a problem submitting your review. Please try again.");
      
      // Still update local state even if API fails
      const newReviews = [reviewData, ...reviews];
      setReviews(newReviews);
      localStorage.setItem(`reviews-${productName}`, JSON.stringify(newReviews));
      calculateReviewStats(newReviews);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div id="customer-reviews" className="py-8 border-t border-gray-200">
        <h2 className="text-xl text-center font-normal mb-6">Customer Reviews</h2>
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="customer-reviews"
      className="py-8 sm:py-10  md:py-12 border-t border-gray-200"
    >
      <h2 className="text-xl sm:text-2xl text-center font-normal mb-6 sm:mb-8  md:mb-10">
        Customer Reviews
      </h2>

      <div className="flex flex-col  md:flex-row justify-between max-w-4xl mx-auto px-4 sm:px-6  md:px-0 gap-8  md:gap-4">
        {/* Left side: Overall Rating */}
        <div className="flex flex-col items-center mb-6  md:mb-0">
          <div className="text-5xl sm:text-6xl font-thin  md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider">
            {averageRating ? averageRating.toFixed(1) : '0.0'}
          </div>
          <div className="flex my-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(averageRating) ? 'text-black' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="text-xs sm:text-sm text-gray-700">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Middle: Rating breakdown */}
        <div className="mb-6  md:mb-0 max-w-xs sm:max-w-none mx-auto  md:mx-0">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-2">
              <div className="w-3">{rating}</div>
              <svg
                className="w-4 h-4 ml-1 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="mx-2 w-32 sm:w-40  md:w-48 bg-gray-200 rounded-sm h-2">
                <div
                  className="h-2 bg-black rounded-sm"
                  style={{
                    width: totalReviews > 0 
                      ? `${(ratingCounts[rating] / totalReviews) * 100}%` 
                      : '0%',
                  }}
                ></div>
              </div>
              <div className="text-sm w-6 text-right">
                {ratingCounts[rating] || 0}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Quality and Fit */}
        <div className="max-w-xs sm:max-w-none mx-auto  md:mx-0">
          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Quality</div>
            <div className="w-full sm:w-40  md:w-48 bg-gray-200 rounded-sm h-2 mb-1">
              <div
                className="h-2 bg-black rounded-sm"
                style={{ 
                  width: qualityRating 
                    ? (qualityRating === "Very High" ? "90%" :
                       qualityRating === "High" ? "75%" :
                       qualityRating === "Okay" ? "50%" : 
                       qualityRating === "Low" ? "25%" : "10%")
                    : "0%" 
                }}
              ></div>
            </div>
            <div className="text-xs text-right">{qualityRating || "Not Rated"}</div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Fit</div>
            <div className="w-full sm:w-40  md:w-48 bg-gray-200 rounded-sm h-2 mb-1">
              <div
                className="h-2 bg-black rounded-sm"
                style={{ 
                  width: fitRating
                    ? (fitRating === "Runs small" ? "25%" :
                       fitRating === "True to size" ? "50%" :
                       fitRating === "Runs large" ? "75%" : "0%")
                    : "0%"
                }}
              ></div>
            </div>
            <div className="text-xs text-right">{fitRating || "Not Rated"}</div>
          </div>
        </div>
      </div>

      {/* Write a review button */}
      <div className="flex justify-center mt-8  md:mt-10">
        {canReview ? ( 
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-black text-white px-6 py-3 text-sm cursor-pointer"
          >
            Write A Review
          </motion.button>
        ) : (
          <p className="text-sm text-gray-600">Purchase this product to leave a review.</p>
        )}
      </div>

      {/* Display Reviews Section */}
      <div className="mt-10  md:mt-12 max-w-4xl mx-auto px-4 sm:px-6  md:px-0">
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex flex-col  md:flex-row">
                  {/* Left column - Reviewer info */}
                  <div className="w-full  md:w-1/4 pr-0  md:pr-6 mb-4  md:mb-0">
                    <div className="mb-4">
                      <div className="font-medium">{review.name}</div>
                      {review.verifiedBuyer && (
                        <div className="text-xs text-gray-600 flex items-center mt-1">
                          <svg
                            className="w-3 h-3 mr-1 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified Buyer
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {review.purchasedSize && (
                        <div>
                          <span className="font-medium">Size</span>
                          <span className="float-right">
                            {review.purchasedSize}
                          </span>
                        </div>
                      )}

                      {review.height && (
                        <div>
                          <span className="font-medium">Height</span>
                          <span className="float-right">{review.height}</span>
                        </div>
                      )}

                      {review.bodyType && review.bodyType.length > 0 && (
                        <div>
                          <span className="font-medium">Body Type</span>
                          <span className="float-right">
                            {review.bodyType[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column - Review content */}
                  <div className="w-full  md:w-3/4">
                    {/* Rating and date */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-black" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.date ? formatDate(review.date) : ""}
                      </span>
                    </div>

                    {/* Review title */}
                    <h3 className="font-medium text-base sm:text-lg mb-2">
                      {review.headline}
                    </h3>

                    {/* Review text */}
                    <p className="text-gray-700 mb-4">{review.review}</p>

                    {/* Product reviewed */}
                    <div className="text-xs text-gray-500 mb-4">
                      Product Reviewed: {review.productName || productName}
                    </div>

                    {/* Quality and Fit indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                      {review.quality && (
                        <div>
                          <div className="text-sm font-medium mb-1">
                            Quality
                          </div>
                          <div className="w-full bg-gray-200 rounded-sm h-1 mb-1">
                            <div
                              className="h-1 bg-black rounded-sm"
                              style={{
                                width:
                                  review.quality === "Very Low"
                                    ? "20%"
                                    : review.quality === "Low"
                                    ? "40%"
                                    : review.quality === "Okay"
                                    ? "60%"
                                    : review.quality === "High"
                                    ? "80%"
                                    : "100%",
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-right">
                            {review.quality}
                          </div>
                        </div>
                      )}

                      {review.overallFit && (
                        <div>
                          <div className="text-sm font-medium mb-1">Fit</div>
                          <div className="w-full bg-gray-200 rounded-sm h-1 mb-1">
                            <div
                              className="h-1 bg-black rounded-sm"
                              style={{
                                width:
                                  review.overallFit === "Runs small"
                                    ? "30%"
                                    : review.overallFit === "True to size"
                                    ? "50%"
                                    : "70%",
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-right">
                            {review.overallFit}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productName={productName}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

CustomersReviews.propTypes = {
  productId: PropTypes.string,
  productName: PropTypes.string,
};

CustomersReviews.defaultProps = {
  productId: "Product ID",
  productName: "Product Name"
};

export default CustomersReviews;