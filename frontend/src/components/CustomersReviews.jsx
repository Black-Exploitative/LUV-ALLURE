import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import ReviewModal from "./ReviewModal";

const CustomersReviews = ({
  averageRating: initialAverageRating = 4.9,
  totalReviews: initialTotalReviews = 90,
  ratingCounts: initialRatingCounts = { 5: 83, 4: 5, 3: 2, 2: 0, 1: 0 },
  productName = "Product",
}) => {
  const [qualityRating, setQualityRating] = useState("Very High");
  const [fitRating, setFitRating] = useState("True to size");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // State for reviews and stats
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalReviews, setTotalReviews] = useState(initialTotalReviews);
  const [ratingCounts, setRatingCounts] = useState(initialRatingCounts);

  // Load stored reviews from localStorage on initial render
  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews-${productName}`);
    if (storedReviews) {
      const parsedReviews = JSON.parse(storedReviews);
      setReviews(parsedReviews);

      // Recalculate stats based on stored reviews
      if (parsedReviews.length > 0) {
        updateReviewStats(parsedReviews);
      }
    }
  }, [productName]);

  // Function to update review statistics
  const updateReviewStats = (reviewsList) => {
    const newTotalReviews = initialTotalReviews + reviewsList.length;

    const newRatingCounts = { ...initialRatingCounts };
    reviewsList.forEach((review) => {
      if (review.rating > 0) {
        newRatingCounts[review.rating] =
          (newRatingCounts[review.rating] || 0) + 1;
      }
    });

    let totalStars = 0;
    let totalRatings = 0;

    // Add up initial ratings
    Object.keys(initialRatingCounts).forEach((rating) => {
      totalStars += parseInt(rating) * initialRatingCounts[rating];
      totalRatings += initialRatingCounts[rating];
    });

    // Add ratings from new reviews
    reviewsList.forEach((review) => {
      if (review.rating > 0) {
        totalStars += review.rating;
        totalRatings += 1;
      }
    });

    const newAverageRating =
      totalRatings > 0
        ? (totalStars / totalRatings).toFixed(1)
        : initialAverageRating;

    setTotalReviews(newTotalReviews);
    setRatingCounts(newRatingCounts);
    setAverageRating(parseFloat(newAverageRating));

    // Update quality and fit ratings based on review data
    updateQualityAndFitRatings(reviewsList);
  };

  // Update quality and fit ratings based on reviews
  const updateQualityAndFitRatings = (reviewsList) => {
    let qualitySum = 0;
    let qualityCount = 0;
    let fitCounts = { "Runs small": 0, "True to size": 0, "Runs large": 0 };

    reviewsList.forEach((review) => {
      // Track quality ratings
      if (review.quality) {
        const qualityValues = {
          "Very Low": 1,
          Low: 2,
          Okay: 3,
          High: 4,
          "Very High": 5,
        };
        if (qualityValues[review.quality]) {
          qualitySum += qualityValues[review.quality];
          qualityCount++;
        }
      }

      // Track fit ratings
      if (review.overallFit && fitCounts[review.overallFit] !== undefined) {
        fitCounts[review.overallFit]++;
      }
    });

    // Only update if we have data
    if (qualityCount > 0) {
      const avgQuality = qualitySum / qualityCount;
      const qualityLabels = ["Very Low", "Low", "Okay", "High", "Very High"];
      setQualityRating(
        qualityLabels[Math.round(avgQuality) - 1] || "Very High"
      );
    }

    let maxFit = "True to size";
    let maxCount = 0;
    for (const [fit, count] of Object.entries(fitCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxFit = fit;
      }
    }
    if (maxCount > 0) {
      setFitRating(maxFit);
    }
  };

  const handleReviewSubmit = (reviewData) => {
    const newReviews = [reviewData, ...reviews];
    setReviews(newReviews);

    // Update localStorage
    localStorage.setItem(`reviews-${productName}`, JSON.stringify(newReviews));

    updateReviewStats(newReviews);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      id="customer-reviews"
      className="py-8 sm:py-10 md:py-12 border-t border-gray-200"
    >
      <h2 className="text-xl sm:text-2xl text-center font-normal mb-6 sm:mb-8 md:mb-10">
        Customer Reviews
      </h2>

      <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto px-4 sm:px-6 md:px-0 gap-8 md:gap-4">
        {/* Left side: Overall Rating */}
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <div className="text-5xl sm:text-6xl font-thin tracking-wide">{averageRating}</div>
          <div className="flex my-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 sm:w-5 sm:h-5 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="text-xs sm:text-sm text-gray-700">
            Based on {totalReviews} reviews
          </div>
        </div>

        {/* Middle: Rating breakdown */}
        <div className="mb-6 md:mb-0 max-w-xs sm:max-w-none mx-auto md:mx-0">
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
              <div className="mx-2 w-32 sm:w-40 md:w-48 bg-gray-200 rounded-sm h-2">
                <div
                  className="h-2 bg-black rounded-sm"
                  style={{
                    width: `${(ratingCounts[rating] / totalReviews) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-sm w-6 text-right">
                {ratingCounts[rating]}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Quality and Fit */}
        <div className="max-w-xs sm:max-w-none mx-auto md:mx-0">
          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Quality</div>
            <div className="w-full sm:w-40 md:w-48 bg-gray-200 rounded-sm h-2 mb-1">
              <div
                className="h-2 bg-black rounded-sm"
                style={{ width: "90%" }}
              ></div>
            </div>
            <div className="text-xs text-right">{qualityRating}</div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Fit</div>
            <div className="w-full sm:w-40 md:w-48 bg-gray-200 rounded-sm h-2 mb-1">
              <div
                className="h-2 bg-black rounded-sm"
                style={{ width: "50%" }}
              ></div>
            </div>
            <div className="text-xs text-right">{fitRating}</div>
          </div>
        </div>
      </div>

      {/* Write a Review Button */}
      <div className="flex justify-center mt-8 md:mt-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsReviewModalOpen(true)}
          className="bg-black text-white px-6 py-3 text-sm cursor-pointer"
        >
          Write A Review
        </motion.button>
      </div>

      {/* Display Reviews Section */}
      <div className="mt-10 md:mt-12 max-w-4xl mx-auto px-4 sm:px-6 md:px-0">
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex flex-col md:flex-row">
                  {/* Left column - Reviewer info */}
                  <div className="w-full md:w-1/4 pr-0 md:pr-6 mb-4 md:mb-0">
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
                  <div className="w-full md:w-3/4">
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
  averageRating: PropTypes.number,
  totalReviews: PropTypes.number,
  ratingCounts: PropTypes.shape({
    1: PropTypes.number,
    2: PropTypes.number,
    3: PropTypes.number,
    4: PropTypes.number,
    5: PropTypes.number,
  }),
  productName: PropTypes.string,
};

export default CustomersReviews;
