import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const ReviewModal = ({ isOpen, onClose, productName = "SWIVEL ALLURE MAXI DRESS", onSubmit}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    review: '',
    headline: '',
    name: '',
    email: '',
    quality: '',
    purchasedSize: '',
    usualSize: '',
    height: '',
    bodyType: [],
    age: '',
    occasion: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (field, value) => {
    let newValues;
    if (formData[field].includes(value)) {
      newValues = formData[field].filter(item => item !== value);
    } else {
      newValues = [...formData[field], value];
    }
    setFormData({ ...formData, [field]: newValues });
  };

  const handleSingleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStarRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log('Submitting review:', formData);

    if (onSubmit) {
      onSubmit({
        ...formData,
        date: new Date().toISOString(),
      });
    }

    onClose();
    // Reset form
    setFormData({
      rating: 0,
      review: '',
      headline: '',
      name: '',
      email: '',
      quality: '',
      purchasedSize: '',
      usualSize: '',
      height: '',
      bodyType: [],
      age: '',
      occasion: []
    });
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded">
        <motion.div
          className="p-8"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-normal">Share your thoughts</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Rate your experience <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="mr-2 focus:outline-none"
                    onClick={() => handleStarRating(star)}
                  >
                    <svg 
                      className="w-8 h-8" 
                      fill={formData.rating >= star ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Write a review <span className="text-red-500">*</span>
              </label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                placeholder="Tell us what you like or dislike"
                className="w-full p-3 border border-gray-300 rounded"
                rows={5}
                required
              />
            </div>

            {/* Review Headline */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Add a headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                placeholder="Summarize your experience"
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2 font-medium">
                  Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Your email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  We will send you an email to verify this review came from you.
                </p>
              </div>
            </div>

           

            {/* Overall Fit */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                How would you describe the overall fit? <span className="text-red-500">*</span>
                <span className="ml-2 text-sm font-normal text-gray-500">Choose 1</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Runs small', 'True to size', 'Runs large'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.overallFit === option 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSingleSelect('overallFit', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Rating */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                How did you find the quality of the product? <span className="text-red-500">*</span>
                <span className="ml-2 text-sm font-normal text-gray-500">Choose 1</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Very Low', 'Low', 'Okay', 'High', 'Very High'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.quality === option 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSingleSelect('quality', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Purchased */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                What size did you purchase?
                <span className="ml-2 text-sm font-normal text-gray-500">Choose 1</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.purchasedSize === size 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSingleSelect('purchasedSize', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Usual Size */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                What is your usual size?
                <span className="ml-2 text-sm font-normal text-gray-500">Choose 1</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL+'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.usualSize === size 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSingleSelect('usualSize', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                What is your height?
                <span className="ml-2 text-sm font-normal text-gray-500">Choose 1</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  '152cm (5\'0") or less',
                  '153-160cm (5\'1-5\'2")',
                  '161-165cm (5\'3-5\'4")',
                  '166-174cm (5\'5-5\'7")',
                  '174-183 (5\'8-6\'0")',
                  '184cm (6\'1) or above'
                ].map((height) => (
                  <button
                    key={height}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.height === height 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSingleSelect('height', height)}
                  >
                    {height}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Type */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                What is your body type?
                <span className="ml-2 text-sm font-normal text-gray-500">Choose all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Curvy on bottom',
                  'Curvy on top',
                  'Full-figured',
                  'Hourglass',
                  'Petite',
                  'Slender',
                  'Tall'
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.bodyType.includes(type) 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleMultiSelect('bodyType', type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Your age?
                <span className="ml-2 text-sm font-normal text-gray-500">Choose 1</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['12-17', '18-24', '25-34', '35-44', '45+'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.age === age 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleSingleSelect('age', age)}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Did you purchase the item for a special occasion?
                <span className="ml-2 text-sm font-normal text-gray-500">Choose all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Treating myself',
                  'Prom / Formal',
                  'Party',
                  'Wedding',
                  'Birthday',
                  'Holiday',
                  'Festival',
                  'Gift',
                  'Other event'
                ].map((occasion) => (
                  <button
                    key={occasion}
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm ${
                      formData.occasion.includes(occasion) 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleMultiSelect('occasion', occasion)}
                  >
                    {occasion}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <p className="text-xs text-red-500">* required fields</p>
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded"
              >
                Send
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productName: PropTypes.string,
  onSubmit: PropTypes.func
};

export default ReviewModal;