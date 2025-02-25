import PropTypes from "prop-types";
import  { useState } from "react";

const ExpandableSection = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="border-b border-gray-300 py-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpansion}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-xl font-bold">
          {isExpanded ? "−" : "+"}
        </span>
      </div>
      {isExpanded && (
        <div className="mt-4 text-gray-700">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

ExpandableSection.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
}

export default ExpandableSection;
