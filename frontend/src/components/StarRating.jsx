import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import PropTypes from "prop-types";


const StarRating = ({ onChange }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (starValue) => {
    setRating(starValue);
    if (onChange) {
      onChange(starValue);
    }
  };

  return (
    <div className="flex mt-2 mb-3">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer"
          >
            {starValue <= (hover || rating) ? (
              <FaStar className="text-black w-5 h-5" />
            ) : (
              <FaRegStar className="text-black w-5 h-5" />
            )}
          </span>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
    onChange: PropTypes.func, 
  };
  

export default StarRating
