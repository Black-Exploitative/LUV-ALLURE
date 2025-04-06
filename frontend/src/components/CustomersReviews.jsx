/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CustomersReviews = ({ averageRating = 4.9, totalReviews = 90, ratingCounts = { 5: 83, 4: 5, 3: 2, 2: 0, 1: 0 } }) => {
  const [qualityRating, setQualityRating] = useState('Very High');
  const [fitRating, setFitRating] = useState('True to size');

  return (
    <div id="customer-reviews" className="py-12 border-t border-gray-200">
      <h2 className="text-2xl text-center font-normal mb-10">Customer Reviews</h2>
      
      <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto">
        {/* Left side: Overall Rating */}
        <div className="flex flex-col items-center mb-8 md:mb-0">
          <div className="text-6xl font-light">{averageRating}</div>
          <div className="flex my-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-gray-700">Based on {totalReviews} reviews</div>

        </div>
        
        {/* Middle: Rating breakdown */}
        <div className="mb-8 md:mb-0">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center mb-2">
              <div className="w-3">{rating}</div>
              <svg className="w-4 h-4 ml-1 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="mx-2 w-48 bg-gray-200 rounded-sm h-2">
                <div 
                  className="h-2 bg-black rounded-sm" 
                  style={{ width: `${(ratingCounts[rating] / totalReviews) * 100}%` }}
                ></div>
              </div>
              <div className="text-sm w-6 text-right">{ratingCounts[rating]}</div>
            </div>
          ))}
        </div>
        
        {/* Right: Quality and Fit */}
        <div>
          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Quality</div>
            <div className="w-48 bg-gray-200 rounded-sm h-2 mb-1">
              <div className="h-2 bg-black rounded-sm" style={{ width: '90%' }}></div>
            </div>
            <div className="text-xs text-right">{qualityRating}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">Fit</div>
            <div className="w-48 bg-gray-200 rounded-sm h-2 mb-1">
              <div className="h-2 bg-black rounded-sm" style={{ width: '50%' }}></div>
            </div>
            <div className="text-xs text-right">{fitRating}</div>
          </div>
        </div>
      </div>
      
      {/* Write a Review Button */}
      <div className="flex justify-center mt-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-black text-white px-6 py-3 text-sm"
        >
          Write A Review
        </motion.button>
      </div>
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
  };
  
  CustomersReviews.defaultProps = {
    averageRating: 4.9,
    totalReviews: 90,
    ratingCounts: { 5: 83, 4: 5, 3: 2, 2: 0, 1: 0 },
  };

export default CustomersReviews;